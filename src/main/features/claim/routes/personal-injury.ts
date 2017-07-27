import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PersonalInjury } from 'forms/models/personalInjury'
import { YesNo } from 'app/forms/models/yesNo'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

function renderView (form: Form<PersonalInjury>, res: express.Response) {
  res.render(Paths.personalInjuryPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.personalInjuryPage.uri, (req: express.Request, res: express.Response) => {
    console.log(res.locals.user.claimDraft)

    renderView(new Form(res.locals.user.claimDraft.personalInjury), res)
  })
  .post(Paths.personalInjuryPage.uri, FormValidator.requestHandler(PersonalInjury, PersonalInjury.fromObject), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<PersonalInjury> = req.body

    if (form.model.personalInjury === YesNo.NO) {
      form.model.generalDamages = undefined
    }

    if (form.hasErrors()) {
      renderView(form, res)
    } else {
      res.locals.user.claimDraft.personalInjury = form.model

      ClaimDraftMiddleware.save(res, next)
        .then(() => {
          res.redirect(Paths.housingDisrepairPage.uri)
        })
    }
  })
