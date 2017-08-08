import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { PartyTypes as DefendantTypes } from 'app/forms/models/partyTypes'
import { DefendantDetails } from 'app/forms/models/defendantDetails'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'

function renderView (form: Form<DefendantDetails>, res: express.Response) {
  const defendants = res.locals.user.legalClaimDraft.defendants

  res.render(Paths.defendantTypePage.associatedView, {
    form: form,
    defendantNumber: defendants.length >= 2 ? 'Defendant ' + defendants.length + ' : ' : null
  })
}

export default express.Router()
  .get(Paths.defendantTypePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.defendants[Defendants.getCurrentNumber(res)].defendantDetails), res)
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

        res.locals.user.legalClaimDraft.defendants[Defendants.getCurrentNumber(res)].defendantDetails = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantAddressPage.uri)

      }
    })
  )
