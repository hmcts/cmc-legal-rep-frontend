import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import { FeeAccount } from 'forms/models/feeAccount'

function renderView (form: Form<FeeAccount>, res: express.Response): void {
  res.render(Paths.payByAccountPage.associatedView,
    {
      form: form,
      feeAmount: 10000 // TODO: Needs to be fixed after ROC-1788 calculate fee is completed.
    })
}

export default express.Router()
  .get(Paths.payByAccountPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.feeAccount.reference), res)
  })
  .post(Paths.payByAccountPage.uri, FormValidator.requestHandler(FeeAccount, FeeAccount.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<FeeAccount> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalClaimDraft.feeAccount.reference = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.claimSubmittedPage.uri)
      }

    }))
