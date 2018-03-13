import * as express from 'express'
import { Paths } from 'claim/paths'
import * as HttpStatus from 'http-status-codes'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { FeeAccount } from 'forms/models/feeAccount'
import FeesClient from 'fees/feesClient'
import ClaimStoreClient from 'claims/claimStoreClient'
import { FeeResponse } from 'fees/model/feeResponse'
import { RepresentativeDetails } from 'forms/models/representativeDetails'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'
import { Cookie } from 'forms/models/cookie'
import CookieProperties from 'common/cookieProperties'
import { Logger } from '@hmcts/nodejs-logging'
import MoneyConverter from 'fees/moneyConverter'
import { PayClient } from 'app/pay/payClient'
import { PaymentResponse } from 'app/pay/model/paymentResponse'
import { ServiceAuthTokenFactoryImpl } from 'common/security/serviceTokenFactoryImpl'

const logger = Logger.getLogger('router/pay-by-account')

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
  await new DraftService()['delete'](draft['id'], res.locals.user.bearerToken)
  res.redirect(Paths.claimSubmittedPage.evaluateUri({ externalId: externalId }))
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
      res.render(Paths.payByAccountPage.associatedView,
        {
          form: form,
          feeAmount: feeResponse.amount
        })
    })
    .catch(next)
}

export default express.Router()
  .get(Paths.payByAccountPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      renderView(new Form(Cookie.getCookie(req.signedCookies.legalRepresentativeDetails, res.locals.user.id).feeAccount), res, next)
    }))

  .post(Paths.payByAccountPage.uri, FormValidator.requestHandler(FeeAccount, FeeAccount.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<FeeAccount> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        draft.document.feeAccount = form.model

        const feeResponse: FeeResponse = await FeesClient.getFeeAmount(draft.document.amount)
        draft.document.feeAmountInPennies = MoneyConverter.convertPoundsToPennies(feeResponse.amount)
        draft.document.feeCode = feeResponse.code

        await new DraftService().save(draft, res.locals.user.bearerToken)

        const legalRepDetails: RepresentativeDetails = Cookie.getCookie(req.signedCookies.legalRepresentativeDetails, res.locals.user.id)
        legalRepDetails.feeAccount = form.model
        res.cookie(legalRepDetails.cookieName,
          Cookie.saveCookie(req.signedCookies.legalRepresentativeDetails, res.locals.user.id, legalRepDetails),
          CookieProperties.getCookieParameters())

        const payClient: PayClient = await getPayClient()

        const paymentResponse: PaymentResponse = await payClient.create(
          res.locals.user,
          draft.document.feeAccount.reference,
          draft.document.externalId,
          draft.document.yourReference.reference,
          feeResponse
        )

        if (paymentResponse.isSuccess) {
          await saveClaimHandler(res, next)
        } else {
          logPaymentError(res.locals.user.id, paymentResponse)
          res.redirect(Paths.payByAccountPage.uri)
        }
      }
    }))
