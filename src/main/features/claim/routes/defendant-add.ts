import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form, FormValidationError } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import ErrorHandling from 'shared/errorHandling'
import { Defendants } from 'shared/router/defendants'
import { DefendantAddition } from 'forms/models/defendantAddition'
import { YesNo } from 'forms/models/yesNo'

import { DraftService } from 'services/draftService'
import { ValidationError } from 'class-validator'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

const MAX_DEFENDANTS_ALLOWED: number = 20
const ERROR_MESSAGE: string = `You can't add more than ${MAX_DEFENDANTS_ALLOWED} defendants`

function renderView (form: Form<DefendantAddition>, res: express.Response) {
  const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
  const defendants = draft.document.defendants

  res.render(Paths.defendantAdditionPage.associatedView, {
    form: form,
    maxAllowedLimit: MAX_DEFENDANTS_ALLOWED,
    defendants: draft.document.isDefendantDeleted || defendants.length > 1 ? defendants : null
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
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<DefendantAddition> = req.body

      if (form.model.isAddDefendant === YesNo.YES && draft.document.defendants.length === MAX_DEFENDANTS_ALLOWED) {
        addErrorMessage(form)
      }

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.isAddDefendant === YesNo.YES) {
          Defendants.addDefendant(res)
          await new DraftService().save(draft, res.locals.user.bearerToken)
          res.redirect(Paths.defendantTypePage.uri)
        } else {
          res.redirect(Paths.personalInjuryPage.uri)
        }
      }
    })
  )
