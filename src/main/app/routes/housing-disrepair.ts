import * as express from 'express'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { HousingDisrepair } from 'forms/models/housingDisrepair'
import { ClaimDraftMiddleware } from 'drafts/claimDraftMiddleware'
import { YesNo } from 'app/forms/models/yesNo'

class Paths {
  static main: string = '/claim/housing-disrepair'
}

export default express.Router()
  .get(Paths.main, (req, res) => {
    res.render('claim/housing-disrepair', { form: new Form(res.locals.user.claimDraft.housingDisrepair) })
  })
  .post(Paths.main, FormValidator.requestHandler(HousingDisrepair, HousingDisrepair.fromObject), (req, res, next) => {
    const form: Form<HousingDisrepair> = req.body
    if (form.model.housingDisrepair === YesNo.NO) {
      form.model.generalDamages = undefined
      form.model.otherDamages = undefined
    }

    if (!form.hasErrors()) {
      res.locals.user.claimDraft.housingDisrepair = form.model
      ClaimDraftMiddleware.save(res, next)
        .then(() => {
          res.redirect('/claim/summarise-the-claim')
        })
    } else {
      res.render('claim/housing-disrepair', { form: form })
    }
  })
