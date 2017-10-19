import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form, FormValidationError } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { DefendantAddition } from 'app/forms/models/defendantAddition'
import { YesNo } from 'app/forms/models/yesNo'

import { DraftService } from 'services/draftService'
import { ValidationError } from 'class-validator'

const MAX_DEFENDANTS_ALLOWED: number = 20
const ERROR_MESSAGE: string = `You can't add more than ${MAX_DEFENDANTS_ALLOWED} defendants`

function renderView (form: Form<DefendantAddition>, res: express.Response) {
  const defendants = res.locals.user.legalClaimDraft.document.defendants

  res.render(Paths.defendantAdditionPage.associatedView, {
    form: form,
    maxAllowedLimit: MAX_DEFENDANTS_ALLOWED,
    defendants: res.locals.user.viewDraft.document.isDefendantDeleted || defendants.length > 1 ? defendants : null
  })
}

let addErrorMessage = function (form: Form<DefendantAddition>) {
  const validationError = new ValidationError()
  validationError.property = 'isAddDefendant'
  validationError.target = { 'isAddDefendant': 'YES' }
  validationError.value = 'YES'
  validationError.constraints = { ['isAddDefendant']: ERROR_MESSAGE }
  form.errors.push(new FormValidationError(validationError, ''))
}
export default express.Router()
  .get(Paths.defendantAdditionPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      renderView(new Form(new DefendantAddition()), res)
    })
  )
  .post(Paths.defendantAdditionPage.uri, FormValidator.requestHandler(DefendantAddition, DefendantAddition.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantAddition> = req.body

      if (form.model.isAddDefendant === YesNo.YES && res.locals.user.legalClaimDraft.document.defendants.length === MAX_DEFENDANTS_ALLOWED) {
        addErrorMessage(form)
      }

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.isAddDefendant === YesNo.YES) {
          Defendants.addDefendant(res)
          await new DraftService()['save'](res.locals.user.legalClaimDraft, res.locals.user.bearerToken)
          res.redirect(Paths.defendantTypePage.uri)
        } else {
          res.redirect(Paths.personalInjuryPage.uri)
        }
      }
    })
  )
