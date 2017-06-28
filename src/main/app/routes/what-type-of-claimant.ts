import * as express from 'express'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ClaimantType } from 'forms/models/claimantType'

class Paths {
  static main: string = '/claim/what-type-of-claimant'
}

export default express.Router()
  .get(Paths.main, (req, res) => {
    res.render('claim/what-type-of-claimant', { form: new Form(res.locals.user.claimDraft.claimantType) })
  })
  .post(Paths.main, FormValidator.requestHandler(ClaimantType, ClaimantType.fromObject), (req, res) => {
    const form: Form<ClaimantType> = req.body

    if (!form.hasErrors()) {
      res.locals.user.claimDraft.interestDate = form.model

    } else {
      res.render('claim/what-type-of-claimant', { form: form })
    }
  })
