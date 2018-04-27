import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'shared/errorHandling'
import { Defendants } from 'shared/router/defendants'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<Address>, res: express.Response): void {

  res.render(Paths.defendantAddressPage.associatedView, {
    form: form,
    partyStripeTitle: Defendants.getPartyStrip(res),
    partyStripeValue: Defendants.getCurrentDefendantName(res)
  })
}

export default express.Router()
  .get(Paths.defendantAddressPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    const index: number = Defendants.getIndex(res)
    renderView(new Form(draft.document.defendants[index].address), res)
  })
  .post(Paths.defendantAddressPage.uri, FormValidator.requestHandler(Address, Address.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<Address> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const index: number = Defendants.getIndex(res)
        draft.document.defendants[index].address = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.defendantRepresentedPage.uri)
      }
    })
  )
