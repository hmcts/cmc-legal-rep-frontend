import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { PartyTypes as ClaimantTypes } from 'app/forms/models/partyTypes'
import { ClaimantDetails } from 'app/forms/models/claimantDetails'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<ClaimantDetails>, res: express.Response) {
  res.render(Paths.claimantTypePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.claimantTypePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.claimant.claimantDetails), res)
  })
  .post(Paths.claimantTypePage.uri, FormValidator.requestHandler(ClaimantDetails, ClaimantDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<ClaimantDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.type === ClaimantTypes.INDIVIDUAL) {
          form.model.organisation = null
          form.model.companyHouseNumber = null
        } else {
          form.model.title = null
          form.model.fullName = null
        }

        res.locals.user.legalClaimDraft.claimant.claimantDetails = form.model

        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.claimantAddressPage.uri)
      }
    })
  )
