import * as express from 'express'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { YourReference } from 'forms/models/yourReference'
import { ClaimDraftMiddleware } from 'drafts/claimDraftMiddleware'

class Paths {
  static main: string = '/claim/your-reference'
}

export default express.Router()
  .get(Paths.main, (req, res) => {
    res.render('claim/your-reference', { form: new Form(res.locals.user.claimDraft.yourReference) })
  })
  .post(Paths.main, FormValidator.requestHandler(YourReference, YourReference.fromObject), (req, res, next) => {
    const form: Form<YourReference> = req.body

    if (!form.hasErrors()) {
      res.locals.user.claimDraft.yourReference = form.model
      ClaimDraftMiddleware.save(res, next)
        .then(() => {
          res.redirect('/claim/personal-injury')
        })
    } else {
      res.render('claim/your-reference', { form: form })
    }
  })
