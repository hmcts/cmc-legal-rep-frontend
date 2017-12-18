import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { PartyTypes as DefendantTypes } from 'app/forms/models/partyTypes'
import { DefendantDetails } from 'app/forms/models/defendantDetails'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<DefendantDetails>, res: express.Response) {
  res.render(Paths.defendantTypePage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.defendantTypePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    const index = Defendants.getIndex(res)
    renderView(new Form(draft.document.defendants[index].defendantDetails), res)
  })
  .post(Paths.defendantTypePage.uri, FormValidator.requestHandler(DefendantDetails, DefendantDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<DefendantDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.type === DefendantTypes.INDIVIDUAL) {
          form.model.organisation = null
          form.model.companyHouseNumber = null
        } else {
          form.model.fullName = null
        }
        const index: number = Defendants.getIndex(res)
        draft.document.defendants[index].defendantDetails = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.defendantAddressPage.uri)

      }
    })
  )
