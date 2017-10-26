import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { RepresentativeDetails } from 'forms/models/representativeDetails'

function renderView (form: Form<Address>, res: express.Response): void {
  res.render(Paths.representativeAddressPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.representativeAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(RepresentativeDetails.getCookie(req).address), res)
  })
  .post(Paths.representativeAddressPage.uri, FormValidator.requestHandler(Address, Address.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Address> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalClaimDraft.document.representative.address = form.model
        await new DraftService().save(res.locals.user.legalClaimDraft, res.locals.user.bearerToken)

        const legalRepDetails: RepresentativeDetails = RepresentativeDetails.getCookie(req)
        legalRepDetails.address = form.model
        RepresentativeDetails.saveCookie(res, legalRepDetails)

        res.redirect(Paths.representativeContactsPage.uri)
      }
    }))
