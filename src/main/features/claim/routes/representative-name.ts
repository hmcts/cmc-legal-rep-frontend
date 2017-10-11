import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import OrganisationName from 'forms/models/organisationName'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import { RepresentativesDetails } from 'forms/models/representativesDetails'

function renderView (form: Form<OrganisationName>, res: express.Response): void {
  res.render(Paths.representativeNamePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.representativeNamePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(RepresentativesDetails.getCookie(req).organisationName), res)
  })
  .post(Paths.representativeNamePage.uri, FormValidator.requestHandler(OrganisationName, OrganisationName.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<OrganisationName> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalClaimDraft.representative.organisationName = form.model
        await ClaimDraftMiddleware.save(res, next)

        const legalRepDetails: RepresentativesDetails = RepresentativesDetails.getCookie(req)
        legalRepDetails.organisationName = form.model
        RepresentativesDetails.saveCookie(res, legalRepDetails)

        res.redirect(Paths.representativeAddressPage.uri)
      }

    }))
