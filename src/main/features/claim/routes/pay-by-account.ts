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
import MoneyConverter from 'app/fees/moneyConverter'
import { FeeResponse } from 'fees/model/feeResponse'
import { RepresentativeDetails } from 'forms/models/representativeDetails'

const logger = require('@hmcts/nodejs-logging').getLogger('router/pay-by-account')

function logError (id: number, message: string) {
  logger.error(`${message} (User Id : ${id})`)
}

async function deleteDraftAndRedirect (res, next, externalId: string) {
  await new DraftService()['delete'](res.locals.user.legalClaimDraft['id'], res.locals.user.bearerToken)
  res.redirect(Paths.claimSubmittedPage.evaluateUri({ externalId: externalId }))
}

async function saveClaimHandler (res, next) {
  const externalId = res.locals.user.legalClaimDraft.document.externalId

  let claimStatus: boolean
  try {
    claimStatus = await ClaimStoreClient.retrieveByExternalId(externalId, res.locals.user.id)
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
    ClaimStoreClient.saveClaimForUser(res.locals.user)
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
  FeesClient.getFeeAmount(res.locals.user.legalClaimDraft.document.amount)
    .then((feeResponse: FeeResponse) => {
      res.render(Paths.payByAccountPage.associatedView,
        {
          form: form,
          feeAmount: MoneyConverter.convertPenniesToPounds(feeResponse.amount)
        })
    })
    .catch(next)
}

export default express.Router()
  .get(Paths.payByAccountPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      renderView(new Form(RepresentativeDetails.getCookie(req).feeAccount), res, next)
    }))

  .post(Paths.payByAccountPage.uri, FormValidator.requestHandler(FeeAccount, FeeAccount.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<FeeAccount> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        res.locals.user.legalClaimDraft.document.feeAccount = form.model

        const feeResponse: FeeResponse = await FeesClient.getFeeAmount(res.locals.user.legalClaimDraft.document.amount)
        res.locals.user.legalClaimDraft.document.feeAmountInPennies = feeResponse.amount
        res.locals.user.legalClaimDraft.document.feeCode = feeResponse.fee.code

        await new DraftService().save(res.locals.user.legalClaimDraft, res.locals.user.bearerToken)

        const legalRepDetails: RepresentativeDetails = RepresentativeDetails.getCookie(req)
        legalRepDetails.feeAccount = form.model
        RepresentativeDetails.saveCookie(res, legalRepDetails)

        await saveClaimHandler(res, next)
      }
    }))
