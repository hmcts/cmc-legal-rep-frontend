import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'
import { PartyTypes } from 'app/forms/models/partyTypes'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'

function renderView (form: Form<Address>, res: express.Response): void {
  const defendantDetails = res.locals.user.legalClaimDraft.defendants[Defendants.getCurrentNumber(res)].defendantDetails
  const isIndividual = defendantDetails.type.value === PartyTypes.INDIVIDUAL.value
  const title = defendantDetails.title != null ? defendantDetails.title + ' ' : defendantDetails.title
  const name = isIndividual ? title + defendantDetails.fullName : defendantDetails.organisation

  res.render(Paths.defendantAddressPage.associatedView, {
    form: form,
    name: name
  })
}

export default express.Router()
  .get(Paths.defendantAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.defendants[Defendants.getCurrentNumber(res)].address), res)
  })
  .post(Paths.defendantAddressPage.uri, FormValidator.requestHandler(Address, Address.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Address> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalClaimDraft.defendants[Defendants.getCurrentNumber(res)].address = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantRepresentedPage.uri)
      }
    })
  )
