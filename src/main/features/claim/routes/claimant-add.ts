import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form, FormValidationError } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import ErrorHandling from 'common/errorHandling'
import { YesNo } from 'app/forms/models/yesNo'

import { ValidationError } from 'class-validator'
import { ClaimantAddition } from 'app/forms/models/claimantAddition'
import { Claimants } from 'common/router/claimants'
import { DraftService } from '../../../services/draftService'

const MAX_CLAIMANTS_ALLOWED: number = 20
const ERROR_MESSAGE: string = `You can't add more than ${MAX_CLAIMANTS_ALLOWED} claimants`

function renderView (form: Form<ClaimantAddition>, res: express.Response) {
  const claimants = res.locals.user.legalClaimDraft.document.claimants

  res.render(Paths.claimantAdditionPage.associatedView, {
    form: form,
    claimants: res.locals.user.viewDraft.document.isClaimantDeleted || claimants.length > 1 ? claimants : null,
    maxAllowedLimit: MAX_CLAIMANTS_ALLOWED
  })
}

let addErrorMessage = function (form: Form<ClaimantAddition>) {
  const validationError = new ValidationError()
  validationError.property = 'isAddClaimant'
  validationError.target = { 'isAddClaimant': 'YES' }
  validationError.value = 'YES'
  validationError.constraints = { ['isAddClaimant']: ERROR_MESSAGE }
  form.errors.push(new FormValidationError(validationError, ''))
}
export default express.Router()
  .get(Paths.claimantAdditionPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(new ClaimantAddition()), res)
  })
  .post(Paths.claimantAdditionPage.uri, FormValidator.requestHandler(ClaimantAddition, ClaimantAddition.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<ClaimantAddition> = req.body

      if (form.model.isAddClaimant === YesNo.YES && res.locals.user.legalClaimDraft.document.claimants.length === MAX_CLAIMANTS_ALLOWED) {
        addErrorMessage(form)
      }

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.isAddClaimant === YesNo.YES) {
          Claimants.addClaimant(res)
          await new DraftService().save(res.locals.user.legalClaimDraft, res.locals.user.bearerToken)
          res.redirect(Paths.claimantNamePage.uri)
        } else if (res.locals.user.legalClaimDraft.document.defendants.length > 1) {
          res.redirect(Paths.defendantAdditionPage.uri)
        } else {
          res.redirect(Paths.defendantTypePage.uri)
        }
      }
    })
  )
