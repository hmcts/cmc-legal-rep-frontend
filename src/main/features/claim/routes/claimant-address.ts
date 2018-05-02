import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'shared/errorHandling'
import { Claimants } from 'shared/router/claimants'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<Address>, res: express.Response): void {

  res.render(Paths.claimantAddressPage.associatedView, {
    form: form,
    partyStripeTitle: Claimants.getPartyStrip(res),
    partyStripeValue: Claimants.getCurrentClaimantName(res)
  })
}

export default express.Router()
  .get(Paths.claimantAddressPage.uri, (req: express.Request, res: express.Response) => {
    const index: number = Claimants.getIndex(res)
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft

    renderView(new Form(draft.document.claimants[index].address), res)
  })
  .post(Paths.claimantAddressPage.uri, FormValidator.requestHandler(Address, Address.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Address> = req.body
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const index: number = Claimants.getIndex(res)
        draft.document.claimants[index].address = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)
        draft.document.claimantChangeIndex = undefined
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.claimantAdditionPage.uri)
      }
    })
  )
