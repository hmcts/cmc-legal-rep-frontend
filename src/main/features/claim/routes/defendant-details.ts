import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { DefendantDetails } from 'app/forms/models/defendantDetails'
import { DefendantTypes } from 'app/forms/models/defendantTypes'

function renderView (form: Form<DefendantDetails>, res: express.Response) {
  res.render(Paths.defendantTypePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantTypePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.defendant.personalDetails), res)
  })
  .post(Paths.defendantTypePage.uri, FormValidator.requestHandler(DefendantDetails, DefendantDetails.fromObject), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<DefendantDetails> = req.body

    if (form.hasErrors()) {
      renderView(form, res)
    } else {
      if (form.model.type === DefendantTypes.INDIVIDUAL) {
        form.model.organisation = undefined
        form.model.companyHouseNumber = undefined
      } else {
        form.model.title = undefined
        form.model.fullName = undefined
      }

      res.locals.user.claimDraft.defendant.personalDetails = form.model

      ClaimDraftMiddleware.save(res, next)
        .then(() => {
          res.redirect(Paths.defendantAddressPage.uri)
        })
    }
  })
