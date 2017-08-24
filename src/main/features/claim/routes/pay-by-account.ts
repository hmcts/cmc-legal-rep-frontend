import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import { FeeAccount } from 'forms/models/feeAccount'
import FeesClient from 'fees/feesClient'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import User from 'idam/user'

function renderView (form: Form<FeeAccount>, res: express.Response, next: express.NextFunction): void {
  FeesClient.getFeeAmount(res.locals.user.legalClaimDraft.amount)
    .then((feeAmount: number) => {
      res.render(Paths.payByAccountPage.associatedView,
        {
          form: form,
          feeAmount: feeAmount
        })
    })
    .catch(next)
}

export default express.Router()
  .get(Paths.payByAccountPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      renderView(new Form(res.locals.user.legalClaimDraft.feeAccount.reference), res, next)
    }))

  .post(Paths.payByAccountPage.uri, FormValidator.requestHandler(FeeAccount, FeeAccount.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<FeeAccount> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        res.locals.user.legalClaimDraft.feeAmountInPennies = FeesClient.convertPoundsToPennies(
          await FeesClient.getFeeAmount(user.legalClaimDraft.amount)
        )
        res.locals.user.legalClaimDraft.feeAccount = form.model
        await ClaimDraftMiddleware.save(res, next)

        const claim: Claim = await ClaimStoreClient.saveClaimForUser(user)
        await ClaimDraftMiddleware.delete(res, next)

        res.redirect(Paths.claimSubmittedPage.uri.replace(':externalId', claim.externalId))
      }

    }))
