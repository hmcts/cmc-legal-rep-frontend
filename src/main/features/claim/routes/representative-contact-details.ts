import * as express from 'express'
import { Form } from 'app/forms/form'
import { Paths } from 'claim/paths'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ContactDetails } from 'app/forms/models/contactDetails'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<ContactDetails>, res: express.Response): void {
  res.render(Paths.representativeContactsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.representativeContactsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.representative.contactDetails), res)
  })
  .post(Paths.representativeContactsPage.uri, FormValidator.requestHandler(ContactDetails, ContactDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<ContactDetails> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.claimDraft.representative.contactDetails = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.yourReferencePage.uri)
      }

    }))
