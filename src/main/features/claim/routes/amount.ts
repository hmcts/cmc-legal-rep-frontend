import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form, FormValidationError } from 'forms/form'
import { Amount, ValidationErrors } from 'app/forms/models/amount'
import { FormValidator } from 'forms/validation/formValidator'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import { ValidationError } from 'class-validator'

function renderView (form: Form<Amount>, res: express.Response): void {
  res.render(Paths.claimAmountPage.associatedView, {
    form: form
  })
}

function addErrorMessage (form: Form<Amount>, fieldName: string, errorMessage: string): void {
  const validationError = new ValidationError()
  validationError.property = fieldName
  validationError.constraints = { [fieldName]: errorMessage }
  form.errors.push(new FormValidationError(validationError, ''))
}

export default express.Router()
  .get(Paths.claimAmountPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.amount), res)
  })
  .post(Paths.claimAmountPage.uri, FormValidator.requestHandler(Amount, Amount.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Amount> = req.body
      const higherValue: number = form.model.higherValue

      if ((higherValue != null && higherValue > 0 ) && form.model.cannotState === Amount.CANNOT_STATE_VALUE) {
        addErrorMessage(form, 'higherValue', ValidationErrors.VALID_SELECTION_REQUIRED)
      }

      if ((form.model.higherValue != null || isNaN(form.model.higherValue)) && form.model.cannotState === Amount.CANNOT_STATE_VALUE) {
        addErrorMessage(form, 'higherValue', ValidationErrors.VALID_SELECTION_REQUIRED)
      }

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.cannotState === Amount.CANNOT_STATE_VALUE) {
          form.model.higherValue = undefined
          form.model.lowerValue = undefined
        } else {
          form.model.cannotState = undefined
        }

        res.locals.user.legalClaimDraft.amount = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.claimTotalPage.uri)
      }
    })
  )
