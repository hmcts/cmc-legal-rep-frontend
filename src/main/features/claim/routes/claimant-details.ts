import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { IndividualTypes } from 'app/forms/models/individualTypes'
import { ClaimantDetails } from 'app/forms/models/claimantDetails'

function renderView (form: Form<ClaimantDetails>, res: express.Response) {
  res.render(Paths.claimantTypePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.claimantTypePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.claimant.claimantDetails), res)
  })
  .post(Paths.claimantTypePage.uri, FormValidator.requestHandler(ClaimantDetails, ClaimantDetails.fromObject), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<ClaimantDetails> = req.body

    if (form.hasErrors()) {
      renderView(form, res)
    } else {
      if (form.model.type === IndividualTypes.INDIVIDUAL) {
        form.model.organisation = null
        form.model.companyHouseNumber = null
      } else {
        form.model.title = null
        form.model.fullName = null
      }

      res.locals.user.claimDraft.claimant.claimantDetails = form.model

      ClaimDraftMiddleware.save(res, next)
        .then(() => {
          res.redirect(Paths.claimantAddressPage.uri)
        })
    }
  })
