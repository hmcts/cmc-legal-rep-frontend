import * as express from 'express'
import { Paths } from 'claim/paths'
import * as HttpStatus from 'http-status-codes'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import ErrorHandling from 'shared/errorHandling'
import { FeeAccount } from 'forms/models/feeAccount'
import FeesClient from 'fees/feesClient'
import ClaimStoreClient from 'claims/claimStoreClient'
import { FeeResponse } from 'fees/model/feeResponse'
import { RepresentativeDetails } from 'forms/models/representativeDetails'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'
import { Cookie } from 'forms/models/cookie'
import CookieProperties from 'shared/cookieProperties'
import { Logger } from '@hmcts/nodejs-logging'
import MoneyConverter from 'fees/moneyConverter'
import { PayClient } from 'pay/payClient'
import { PaymentResponse } from 'pay/model/paymentResponse'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'
import { User } from 'idam/user'

const logger = Logger.getLogger('router/pay-by-account-summary')

function logError (id: number, message: string) {
  logger.error(`${message} (User Id : ${id})`)
}

const getPayClient = async (): Promise<PayClient> => {
  const authToken = await new ServiceAuthTokenFactoryImpl().get()

  return new PayClient(authToken)
}

function logPaymentError (id: string, payment: PaymentResponse) {
  const message: string = 'Payment have failed, see payment information: '
  logger.error(`${message} (User Id : ${id}, Payment: ${JSON.stringify(payment)})`)
}

async function deleteDraftAndRedirect (res, next, externalId: string) {
  const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
  await new DraftService().delete(draft.id, res.locals.user.bearerToken)
  res.redirect(Paths.claimSubmittedPage.evaluateUri({ externalId: externalId }))
}

async function updatePayment (res, next, externalId: string, claim) {
  const ccdCaseNumber = claim.ccdCaseId === undefined ? externalId : String(claim.ccdCaseId)
  const payClient: PayClient = await getPayClient()
  const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
  await payClient.update(res.locals.user, draft.document.paymentResponse.reference, externalId, ccdCaseNumber)
}

async function saveClaimHandler (res, next) {
  const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
  const externalId = draft.document.externalId

  let claimStatus: boolean
  try {
    claimStatus = await ClaimStoreClient.retrieveByExternalId(externalId, res.locals.user)
      .then(() => true)
  } catch (err) {
    if (err.statusCode === HttpStatus.NOT_FOUND) {
      claimStatus = false
    } else {
      logError(res.locals.user.id, `There is a problem retrieving claim from claim store externalId: ${externalId},`)
      next(err)
      return
    }
  }

  if (claimStatus) {
    deleteDraftAndRedirect(res, next, externalId)
  } else {
    ClaimStoreClient.saveClaimForUser(res.locals.user, res.locals.legalClaimDraft)
      .then(claim => {
        updatePayment(res, next, externalId, claim)
        deleteDraftAndRedirect(res, next, externalId)
      })
      .catch(err => {
        if (err.statusCode === HttpStatus.CONFLICT) {
          deleteDraftAndRedirect(res, next, externalId)
        } else {
          next(err)
        }
      })
  }
}

function renderView (form: Form<FeeAccount>, res: express.Response, next: express.NextFunction): void {
  const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
  FeesClient.getFeeAmount(draft.document.amount)
    .then((feeResponse: FeeResponse) => {
      res.render(Paths.payByAccountSummaryPage.associatedView,
        {
          form: form,
          feeAmount: feeResponse.amount,
          reference: draft.document.feeAccount.reference
        })
    })
    .catch(next)
}

export default express.Router()
  .get(Paths.payByAccountSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      process.env.PBA_ERROR_CODE = ''
      process.env.PBA_ERROR_MESSAGE = ''
      renderView(new Form(Cookie.getCookie(req.signedCookies.legalRepresentativeDetails, res.locals.user.id).feeAccount), res, next)
    }))

  .post(Paths.payByAccountSummaryPage.uri, FormValidator.requestHandler(FeeAccount, FeeAccount.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<FeeAccount> = req.body
      process.env.PBA_ERROR_CODE = ''
      process.env.PBA_ERROR_MESSAGE = ''

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        draft.document.feeAccount = form.model

        const feeResponse: FeeResponse = await FeesClient.getFeeAmount(draft.document.amount)

        const user: User = res.locals.user
        const legalRepDetails: RepresentativeDetails = Cookie.getCookie(req.signedCookies.legalRepresentativeDetails, user.id)
        legalRepDetails.feeAccount = form.model
        res.cookie(legalRepDetails.cookieName,
          Cookie.saveCookie(req.signedCookies.legalRepresentativeDetails, user.id, legalRepDetails),
          CookieProperties.getCookieParameters())

        const paymentReference: string = draft.document.paymentResponse ? draft.document.paymentResponse.reference : undefined
        if (paymentReference) {
          await saveClaimHandler(res, next)
        } else {
          const payClient: PayClient = await getPayClient()
          const paymentResponse: PaymentResponse = await payClient.create(
            user,
            draft.document.feeAccount.reference,
            draft.document.externalId,
            draft.document.yourReference.reference,
            draft.document.representative.organisationName.name,
            feeResponse,
            draft.document.externalId
          )

          if (paymentResponse.isSuccess) {
            draft.document.feeAmountInPennies = MoneyConverter.convertPoundsToPennies(feeResponse.amount)
            draft.document.feeCode = feeResponse.code
            draft.document.paymentResponse = paymentResponse
            await new DraftService().save(draft, user.bearerToken)
            await saveClaimHandler(res, next)
          } else {
            logPaymentError(user.id, paymentResponse)
            process.env.PBA_ERROR_CODE = paymentResponse.errorCode
            process.env.PBA_ERROR_MESSAGE = 'Failed'
            if (paymentResponse.errorCode.toString() === '403') {
              if (paymentResponse.errorMessage !== undefined && paymentResponse.errorCodeMessage !== undefined) {
                process.env.PBA_ERROR_MESSAGE = paymentResponse.errorCodeMessage
              }
            }
            renderView(form, res, next)
            res.redirect(Paths.payByAccountSummaryPage.uri)
          }
        }
      }
    }))
