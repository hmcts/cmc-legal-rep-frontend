import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PersonalInjury } from 'forms/models/personalInjury'
import { YesNo } from 'app/forms/models/yesNo'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<PersonalInjury>, res: express.Response) {
  res.render(Paths.personalInjuryPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.personalInjuryPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.draftLegalClaim.personalInjury), res)
  })
  .post(Paths.personalInjuryPage.uri, FormValidator.requestHandler(PersonalInjury, PersonalInjury.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<PersonalInjury> = req.body

      if (form.model.personalInjury === YesNo.NO) {
        form.model.generalDamages = undefined
      }

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.draftLegalClaim.personalInjury = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.housingDisrepairPage.uri)
      }
    })
  )
