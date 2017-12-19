import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { OrganisationName } from 'forms/models/organisationName'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { RepresentativeDetails } from 'forms/models/representativeDetails'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<OrganisationName>, res: express.Response): void {
  res.render(Paths.representativeNamePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.representativeNamePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(RepresentativeDetails.getCookie(req).organisationName), res)
  })
  .post(Paths.representativeNamePage.uri, FormValidator.requestHandler(OrganisationName, OrganisationName.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<OrganisationName> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
        draft.document.representative.organisationName = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)

        const legalRepDetails: RepresentativeDetails = RepresentativeDetails.getCookie(req)
        legalRepDetails.organisationName = form.model
        RepresentativeDetails.saveCookie(res, legalRepDetails)

        res.redirect(Paths.representativeAddressPage.uri)
      }
    }))
