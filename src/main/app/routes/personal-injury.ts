import * as express from 'express'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PersonalInjury } from 'forms/models/personalInjury'
import { ClaimDraftMiddleware } from 'drafts/claimDraftMiddleware'

class Paths {
  static main: string = '/claim/personal-injury'
}

export default express.Router()
  .get(Paths.main, (req, res) => {
    res.render('claim/personal-injury', { form: new Form(res.locals.user.claimDraft.personalInjury) })
  })
  .post(Paths.main, FormValidator.requestHandler(PersonalInjury, PersonalInjury.fromObject), (req, res, next) => {
    const form: Form<PersonalInjury> = req.body

    if (!form.hasErrors()) {
      res.locals.user.claimDraft.personalInjury = form.model
      ClaimDraftMiddleware.save(res, next)
        .then(() => {
          res.redirect('/claim/start')
        })
    } else {
      res.render('claim/personal-injury', { form: form })
    }
  })
