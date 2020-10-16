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
import RefDataClient from 'main/app/refData/refData'
import { OrganisationEntityResponse } from 'forms/models/OrganisationEntityResponse'

const logger = Logger.getLogger('router/pay-by-account')

function logError (id: number, message: string) {
  logger.error(`${message} (User Id : ${id})`)
}

const getPayClient = async (): Promise<PayClient> => {
  const authToken = await new ServiceAuthTokenFactoryImpl().get()

  return new PayClient(authToken)
}

const getRefDataClient = async (): Promise<RefDataClient> => {
  const authToken = await new ServiceAuthTokenFactoryImpl().get()

  return new RefDataClient(authToken)
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
        await new DraftService().save(draft, res.locals.user.bearerToken)
        const user: User = res.locals.user
        const refDataClient: RefDataClient = await getRefDataClient()
        const organisationEntityResponse: OrganisationEntityResponse = await refDataClient.getAccountsForOrganisation(draft.document.representative.organisationName.name, user.email)
        organisationEntityResponse.paymentAccount.forEach(paymentaccount => {
          if (draft.document.feeAccount.reference === paymentaccount) {
             // redirect to next screen if pba number matches reference data
            const legalRepDetails: RepresentativeDetails = Cookie.getCookie(req.signedCookies.legalRepresentativeDetails, user.id)
            legalRepDetails.feeAccount = form.model
            res.cookie(legalRepDetails.cookieName,
            Cookie.saveCookie(req.signedCookies.legalRepresentativeDetails, user.id, legalRepDetails),
            CookieProperties.getCookieParameters())
            process.env.PBA_ERROR = ''
            res.redirect(Paths.payByAccountPage.uri)
          }
        })
        process.env.PBA_ERROR = 'Fee Account is invalid or not linked to the User. Try another Fee Account'
        renderView(form, res, next)
        // remove below code once migrated to new screen
        const feeResponse: FeeResponse = await FeesClient.getFeeAmount(draft.document.amount)
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
            res.redirect(Paths.payByAccountPage.uri)
          }
        }
      }
    }))
