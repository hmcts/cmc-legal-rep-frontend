import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { PartyTypes as DefendantTypes } from 'app/forms/models/partyTypes'
import { DefendantDetails } from 'app/forms/models/defendantDetails'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<DefendantDetails>, res: express.Response) {
  res.render(Paths.defendantTypePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantTypePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.draftLegalClaim.defendant.defendantDetails), res)
  })
  .post(Paths.defendantTypePage.uri, FormValidator.requestHandler(DefendantDetails, DefendantDetails.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantDetails> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.type === DefendantTypes.INDIVIDUAL) {
          form.model.organisation = null
          form.model.companyHouseNumber = null
        } else {
          form.model.title = null
          form.model.fullName = null
        }

        res.locals.user.draftLegalClaim.defendant.defendantDetails = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantAddressPage.uri)

      }
    })
  )
