import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { IndividualTypes } from 'app/forms/models/individualTypes'

function renderView (form: Form<Address>, res: express.Response): void {
  const defendantDetails = res.locals.user.claimDraft.defendant.defendantDetails
  const isIndividual = defendantDetails.type.value === IndividualTypes.INDIVIDUAL.value
  const title = defendantDetails.title != null ? defendantDetails.title + ' ' : defendantDetails.title
  const name = isIndividual ? title + defendantDetails.fullName : defendantDetails.organisation
  res.render(Paths.defendantAddressPage.associatedView, {
    form: form,
    name: name
  })
}

export default express.Router()
  .get(Paths.defendantAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.defendant.address), res)
  })
  .post(Paths.defendantAddressPage.uri, FormValidator.requestHandler(Address), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<Address> = req.body

    if (form.hasErrors()) {
      renderView(form, res)
    } else {
      res.locals.user.claimDraft.defendant.address = form.model
      ClaimDraftMiddleware.save(res, next)
        .then(() => res.redirect(Paths.defendantRepresentedPage.uri))
    }
  })
