import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'shared/errorHandling'
import { RepresentativeDetails } from 'forms/models/representativeDetails'
import { Cookie } from 'forms/models/cookie'
import CookieProperties from 'shared/cookieProperties'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<Address>, res: express.Response): void {
  res.render(Paths.representativeAddressPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.representativeAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(Cookie.getCookie(req.signedCookies.legalRepresentativeDetails, res.locals.user.id).address), res)
  })
  .post(Paths.representativeAddressPage.uri, FormValidator.requestHandler(Address, Address.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Address> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
        draft.document.representative.address = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)

        const legalRepDetails: RepresentativeDetails = Cookie.getCookie(req.signedCookies.legalRepresentativeDetails, res.locals.user.id)
        legalRepDetails.address = form.model
        res.cookie(legalRepDetails.cookieName,
          Cookie.saveCookie(req.signedCookies.legalRepresentativeDetails, res.locals.user.id, legalRepDetails),
          CookieProperties.getCookieParameters())

        res.redirect(Paths.representativeContactsPage.uri)
      }
    }))
