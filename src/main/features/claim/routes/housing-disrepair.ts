import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { HousingDisrepair } from 'app/forms/models/housingDisrepair'
import { YesNo } from 'app/forms/models/yesNo'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

function renderView (form: Form<HousingDisrepair>, res: express.Response) {
  res.render(Paths.housingDisrepairPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.housingDisrepairPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.housingDisrepair), res)
  })
  .post(Paths.housingDisrepairPage.uri, FormValidator.requestHandler(HousingDisrepair, HousingDisrepair.fromObject), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<HousingDisrepair> = req.body

    if (form.hasErrors()) {
      renderView(form, res)
    } else {
      if (form.model.housingDisrepair === YesNo.NO) {
        form.model.generalDamages = undefined
        form.model.otherDamages = undefined
      }

      res.locals.user.claimDraft.housingDisrepair = form.model

      ClaimDraftMiddleware.save(res, next)
        .then(() => {
          res.redirect(Paths.summariseTheClaimPage.uri)
        })
    }
  })
