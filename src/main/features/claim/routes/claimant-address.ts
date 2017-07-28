import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

function renderView (form: Form<Address>, res: express.Response): void {
  res.render(Paths.claimantAddressPage.associatedView, {
    form: form,
    name: res.locals.user.claimDraft.claimant.name.text
  })
}

export default express.Router()
  .get(Paths.claimantAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.claimant.address), res)
  })
  .post(Paths.claimantAddressPage.uri, FormValidator.requestHandler(Address), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<Address> = req.body

    if (form.hasErrors()) {
      renderView(form, res)
    } else {
      res.locals.user.claimDraft.claimant.address = form.model

      ClaimDraftMiddleware.save(res, next)
        .then(() => res.redirect(Paths.defendantTypePage.uri))
    }
  })
