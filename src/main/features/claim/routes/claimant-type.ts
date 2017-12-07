import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { PartyType as ClaimantTypes } from 'app/common/partyType'
import { ClaimantDetails } from 'app/forms/models/claimantDetails'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { Claimants } from 'common/router/claimants'

function renderView (form: Form<ClaimantDetails>, res: express.Response) {
  res.render(Paths.claimantTypePage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.claimantTypePage.uri, (req: express.Request, res: express.Response) => {
    const index = Claimants.getIndex(res)
    renderView(new Form(res.locals.user.legalClaimDraft.document.claimants[index].claimantDetails), res)
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
        const index = Claimants.getIndex(res)
        res.locals.user.legalClaimDraft.document.claimants[index].claimantDetails = form.model

        await new DraftService().save(res.locals.user.legalClaimDraft, res.locals.user.bearerToken)
        res.redirect(Paths.claimantAddressPage.uri)
      }
    })
  )
