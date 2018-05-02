import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PartyType as DefendantType } from 'common/partyType'
import { DefendantDetails } from 'forms/models/defendantDetails'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'shared/errorHandling'
import { Defendants } from 'shared/router/defendants'
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
        switch (form.model.type) {
          case DefendantType.INDIVIDUAL:
            form.model.organisation = undefined
            form.model.companyHouseNumber = undefined
            form.model.soleTraderName = undefined
            form.model.businessName = undefined
            break
          case DefendantType.ORGANISATION:
            form.model.fullName = undefined
            form.model.soleTraderName = undefined
            form.model.businessName = undefined
            break
          case DefendantType.SOLE_TRADER:
            form.model.fullName = undefined
            form.model.organisation = undefined
            form.model.companyHouseNumber = undefined
            break
        }

        const index: number = Defendants.getIndex(res)
        draft.document.defendants[index].defendantDetails = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.defendantAddressPage.uri)

      }
    })
  )
