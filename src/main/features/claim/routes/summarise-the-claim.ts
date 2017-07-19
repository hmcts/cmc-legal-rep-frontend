import * as express from 'express'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import Summary from 'app/forms/models/summary'

import { ClaimDraftMiddleware } from '../draft/claimDraftMiddleware'

class Paths {
  static base: string = '/claim/summarise-the-claim'
}

export default express.Router()
  .get(Paths.base, ( req, res ) => {
    res.render('claim/summarise-the-claim', {form: new Form(res.locals.user.claimDraft.summary)})
  })
  .post(Paths.base, FormValidator.requestHandler(Summary), ( req, res, next ) => {
    const form: Form<Summary> = req.body
    if (form.hasErrors()) {
      res.render('claim/summarise-the-claim', {form: form})
    } else {
      res.locals.user.claimDraft.summary = form.model
      ClaimDraftMiddleware.save(res, next)
        .then(() => res.redirect('/claim/summarise-the-claim'))
    }
  })
