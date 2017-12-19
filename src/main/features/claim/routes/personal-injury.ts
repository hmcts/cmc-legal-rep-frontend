import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PersonalInjury } from 'forms/models/personalInjury'
import { YesNo } from 'app/forms/models/yesNo'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<PersonalInjury>, res: express.Response) {
  res.render(Paths.personalInjuryPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.personalInjuryPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    renderView(new Form(draft.document.personalInjury), res)
  })
  .post(Paths.personalInjuryPage.uri, FormValidator.requestHandler(PersonalInjury, PersonalInjury.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<PersonalInjury> = req.body

      if (form.model.personalInjury === YesNo.NO) {
        form.model.generalDamages = undefined
      }

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        draft.document.personalInjury = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.housingDisrepairPage.uri)
      }
    })
  )
