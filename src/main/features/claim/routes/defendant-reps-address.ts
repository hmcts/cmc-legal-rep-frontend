import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<Address>, res: express.Response): void {
  res.render(Paths.defendantRepAddressPage.associatedView, {
    form: form,
    name: res.locals.user.draftLegalClaim.defendant.defendantRepresented.companyName
  })
}

export default express.Router()
  .get(Paths.defendantRepAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.draftLegalClaim.defendant.representative.address), res)
  })
  .post(Paths.defendantRepAddressPage.uri, FormValidator.requestHandler(Address, Address.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Address> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.draftLegalClaim.defendant.representative.address = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.personalInjuryPage.uri)
      }
    })
  )
