import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import OrganisationName from 'forms/models/organisationName'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<OrganisationName>, res: express.Response): void {
  res.render(Paths.representativeNamePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.representativeNamePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.document.representative.organisationName), res)
  })
  .post(Paths.representativeNamePage.uri, FormValidator.requestHandler(OrganisationName, OrganisationName.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<OrganisationName> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalClaimDraft.document.representative.organisationName = form.model
        await new DraftService()['save'](res.locals.user.legalClaimDraft, res.locals.user.bearerToken)
        res.redirect(Paths.representativeAddressPage.uri)
      }

    }))
