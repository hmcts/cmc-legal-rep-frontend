import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import { Claimants } from 'common/router/claimants'
import { ViewDraftMiddleware } from 'views/draft/viewDraftMiddleware'

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
    renderView(new Form(res.locals.user.legalClaimDraft.claimants[index].address), res)
  })
  .post(Paths.claimantAddressPage.uri, FormValidator.requestHandler(Address, Address.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Address> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const index: number = Claimants.getIndex(res)
        res.locals.user.legalClaimDraft.claimants[index].address = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.locals.user.viewDraft.claimantChangeIndex = undefined
        await ViewDraftMiddleware.save(res, next)
        res.redirect(Paths.claimantAdditionPage.uri)
      }
    })
  )
