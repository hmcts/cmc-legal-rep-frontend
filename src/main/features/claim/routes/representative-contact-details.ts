import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ContactDetails } from 'app/forms/models/contactDetails'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { RepresentativeDetails } from 'forms/models/representativeDetails'
import { Cookie } from 'forms/models/cookie'
import CookieProperties from 'common/cookieProperties'

function renderView (form: Form<ContactDetails>, res: express.Response): void {
  res.render(Paths.representativeContactsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.representativeContactsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(Cookie.getCookie(req.signedCookies.legalRepresentativeDetails, res.locals.user.id).contactDetails), res)
  })
  .post(Paths.representativeContactsPage.uri, FormValidator.requestHandler(ContactDetails, ContactDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<ContactDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalClaimDraft.document.representative.contactDetails = form.model
        await new DraftService().save(res.locals.user.legalClaimDraft, res.locals.user.bearerToken)

        const legalRepDetails: RepresentativeDetails = Cookie.getCookie(req.signedCookies.legalRepresentativeDetails, res.locals.user.id)
        legalRepDetails.contactDetails = form.model
        res.cookie(legalRepDetails.cookieName,
          Cookie.saveCookie(req.signedCookies.legalRepresentativeDetails, res.locals.user.id, legalRepDetails),
          CookieProperties.getCookieParameters())

        res.redirect(Paths.yourReferencePage.uri)
      }

    }))
