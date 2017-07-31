import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'
import { PartyTypes } from 'app/forms/models/partyTypes'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<Address>, res: express.Response): void {
  const claimantDetails = res.locals.user.claimDraft.claimant.claimantDetails
  const isIndividual = claimantDetails.type.value === PartyTypes.INDIVIDUAL.value
  const title = claimantDetails.title != null ? claimantDetails.title + ' ' : claimantDetails.title
  const name = isIndividual ? title + claimantDetails.fullName : claimantDetails.organisation

  res.render(Paths.claimantAddressPage.associatedView, {
    form: form,
    name: name
  })
}

export default express.Router()
  .get(Paths.claimantAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.claimant.address), res)
  })
  .post(Paths.claimantAddressPage.uri, FormValidator.requestHandler(Address),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Address> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.claimant.address = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantTypePage.uri)
      }
    })
  )
