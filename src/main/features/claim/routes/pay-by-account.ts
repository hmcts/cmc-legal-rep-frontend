import * as express from 'express'
import { Paths } from 'claim/paths'

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
import { YourReference } from 'forms/models/yourReference'
import Representative from 'drafts/models/representative'
import { OrganisationName } from 'forms/models/organisationName'

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
  await new DraftService().delete(draft.id, res.locals.user.bearerToken)
  res.redirect(Paths.claimSubmittedPage.evaluateUri({ externalId: externalId }))
}

async function updateHandler (res, next, externalId: string) {
  const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
  ClaimStoreClient.updateClaimForUser(res.locals.user, draft)
  .then(claim => {
    if (draft.document.paymentResponse.status === 'Success') {
      deleteDraftAndRedirect(res, next, externalId)
    }
  })
  .catch(err => {
    next(err)
  })
}

function renderView (form: Form<FeeAccount>, res: express.Response, next: express.NextFunction): void {
  const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
  FeesClient.getFeeAmount(draft.document.amount)
    .then((feeResponse: FeeResponse) => {
      res.render(Paths.payByAccountPage.associatedView,
        {
          form: form,
          feeAmount: feeResponse.amount,
          PBA_ERROR_CODE: draft.document.paymentResponse !== undefined && draft.document.paymentResponse.errorCode !== undefined ? draft.document.paymentResponse.errorCode.toString() : ''
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
      const user: User = res.locals.user
      let pbaNumber: any
      let externalId = draft.document.externalId
      let yourReference = draft.document.yourReference.reference
      let orgName = draft.document.representative.organisationName.name
      let ccdCaseNumber = draft.document.ccdCaseId ? draft.document.ccdCaseId : undefined

      if (form.hasErrors()) {
        draft.document.paymentResponse = new PaymentResponse()
        await new DraftService().save(draft, user.bearerToken)
        renderView(form, res, next)
      } else {
        const message: string = 'Payment draft object: '
        logger.error(`${message} (User Id : ${123}, Payment: ${JSON.stringify(draft.document.amount)})`)

        const feeResponse: FeeResponse = await FeesClient.getFeeAmount(draft.document.amount)
        // Saving the claim before invoking the F&P
        if (!draft.document.ccdCaseId) {
          await ClaimStoreClient.saveClaimForUser(res.locals.user, res.locals.legalClaimDraft)
            .then(async claim => {
              ccdCaseNumber = claim.ccdCaseId
            })
            .catch(err => {
              logError(res.locals.user.id, err.statusCode)
            })
        }

        draft.document.feeAccount = form.model
        draft.document.ccdCaseId = draft.document.ccdCaseId === undefined ? ccdCaseNumber : draft.document.ccdCaseId
        if (draft.document.yourReference === undefined) {
          draft.document.yourReference = new YourReference()
        }
        draft.document.yourReference.reference = draft.document.yourReference.reference === undefined ? yourReference : draft.document.yourReference.reference
        if (draft.document.representative === undefined) {
          draft.document.representative = new Representative()
          draft.document.representative.organisationName = new OrganisationName()
        }
        draft.document.representative.organisationName.name = orgName
        pbaNumber = form.model.reference

        await new DraftService().save(draft, user.bearerToken)
        const legalRepDetails: RepresentativeDetails = Cookie.getCookie(req.signedCookies.legalRepresentativeDetails, user.id)
        legalRepDetails.feeAccount = form.model
        res.cookie(legalRepDetails.cookieName,
          Cookie.saveCookie(req.signedCookies.legalRepresentativeDetails, user.id, legalRepDetails),
          CookieProperties.getCookieParameters())

        const payClient: PayClient = await getPayClient()
        const paymentResponse: PaymentResponse = await payClient.create(
          user,
          pbaNumber,
          externalId,
          yourReference,
          orgName,
          feeResponse,
          ccdCaseNumber ? ccdCaseNumber.toString() : undefined
        )
        if (paymentResponse.isSuccess) {
          draft.document.feeAmountInPennies = MoneyConverter.convertPoundsToPennies(feeResponse.amount)
          draft.document.feeCode = feeResponse.code
          draft.document.paymentResponse = paymentResponse
          logger.error(`Payment Response: ${JSON.stringify(paymentResponse)})`)
          await new DraftService().save(draft, user.bearerToken)
          await updateHandler(res, next, externalId)
        } else {
          draft.document.feeAmountInPennies = MoneyConverter.convertPoundsToPennies(feeResponse.amount)
          draft.document.feeCode = feeResponse.code
          draft.document.paymentResponse = paymentResponse
          await new DraftService().save(draft, res.locals.user.bearerToken)
          await updateHandler(res, next, externalId)
          logError(res.locals.user.id, 'Payment' + paymentResponse.status)
          logPaymentError(user.id, paymentResponse)
          res.redirect(Paths.payByAccountPage.uri)
        }
      }
    }))
