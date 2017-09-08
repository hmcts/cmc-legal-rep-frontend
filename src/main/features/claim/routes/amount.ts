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

function handleWhenAnyValueAndCannotStateSelected (form: Form<Amount>): void {
  const higherValue: number = form.model.higherValue
  const lowerValue: number = form.model.lowerValue
  const higherValueEntered: boolean = higherValue != null && higherValue > 0
  const lowerValueEntered: boolean = lowerValue != null && lowerValue > 0
  const canNotStateSelected: boolean = form.model.cannotState === Amount.CANNOT_STATE_VALUE
  const onlyLowerValueEntered: boolean = (lowerValueEntered && !higherValueEntered)
  const canNotStateAndAnyValueEntered: boolean = (higherValueEntered || onlyLowerValueEntered) && canNotStateSelected

  if (canNotStateAndAnyValueEntered) {
    addErrorMessage(form, 'higherValue', ValidationErrors.VALID_SELECTION_REQUIRED)
  }
}

export default express.Router()
  .get(Paths.claimAmountPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.amount), res)
  })
  .post(Paths.claimAmountPage.uri, FormValidator.requestHandler(Amount, Amount.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Amount> = req.body
      handleWhenAnyValueAndCannotStateSelected(form)

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
