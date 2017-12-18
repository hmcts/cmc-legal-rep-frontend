import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'
import { DraftView } from 'app/drafts/models/draftView'

function renderView (form: Form<Address>, res: express.Response): void {
  const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
  const defendants = draft.document.defendants

  res.render(Paths.defendantRepAddressPage.associatedView, {
    form: form,
    partyStripeTitle: Defendants.getPartyStripeTitleForRepresentative(res),
    partyStripeValue: defendants[Defendants.getIndex(res)].defendantRepresented.organisationName
  })
}

export default express.Router()
  .get(Paths.defendantRepAddressPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    const index: number = Defendants.getIndex(res)
    renderView(new Form(draft.document.defendants[index].representative.address), res)
  })
  .post(Paths.defendantRepAddressPage.uri, FormValidator.requestHandler(Address, Address.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const viewDraft: Draft<DraftView> = res.locals.viewDraft
      const form: Form<Address> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const index: number = Defendants.getIndex(res)
        draft.document.defendants[index].representative.address = form.model
        viewDraft.document.defendantChangeIndex = undefined
        await new DraftService().save(viewDraft, res.locals.user.bearerToken)
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.defendantAdditionPage.uri)
      }
    })
  )
