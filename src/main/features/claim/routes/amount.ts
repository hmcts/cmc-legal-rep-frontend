import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { Amount } from 'app/forms/models/amount'
import { FormValidator } from 'forms/validation/formValidator'

import ErrorHandling from 'common/errorHandling'
import { DraftService } from '../../../services/draftService'

function renderView (form: Form<Amount>, res: express.Response): void {
  res.render(Paths.claimAmountPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.claimAmountPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.document.amount), res)
  })
  .post(Paths.claimAmountPage.uri, FormValidator.requestHandler(Amount, Amount.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Amount> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.cannotState === Amount.CANNOT_STATE_VALUE) {
          form.model.higherValue = undefined
          form.model.lowerValue = undefined
        } else {
          form.model.cannotState = undefined
        }

        res.locals.user.legalClaimDraft.document.amount = form.model
        await new DraftService().save(res.locals.user.legalClaimDraft, res.locals.user.bearerToken)
        res.redirect(Paths.claimTotalPage.uri)
      }
    })
  )
