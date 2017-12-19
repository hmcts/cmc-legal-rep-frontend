import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { PartyTypes as ClaimantTypes } from 'app/forms/models/partyTypes'
import { ClaimantDetails } from 'app/forms/models/claimantDetails'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { Claimants } from 'common/router/claimants'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<ClaimantDetails>, res: express.Response) {
  res.render(Paths.claimantTypePage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.claimantTypePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    const index = Claimants.getIndex(res)
    renderView(new Form(draft.document.claimants[index].claimantDetails), res)
  })
  .post(Paths.claimantTypePage.uri, FormValidator.requestHandler(ClaimantDetails, ClaimantDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<ClaimantDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.type === ClaimantTypes.INDIVIDUAL) {
          form.model.organisation = null
          form.model.companyHouseNumber = null
        } else {
          form.model.fullName = null
        }
        const index = Claimants.getIndex(res)
        draft.document.claimants[index].claimantDetails = form.model

        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.claimantAddressPage.uri)
      }
    })
  )
