import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import Amount from 'app/forms/models/amount'
import { FormValidator } from 'forms/validation/formValidator'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<Amount>, res: express.Response): void {
  res.render(Paths.claimantAddressPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.claimAmountPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.amount), res)
  })
  .post(Paths.claimAmountPage.uri, FormValidator.requestHandler(Amount, Amount.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Amount> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.amount = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.claimTotalPage.uri)
      }
    })
  )
