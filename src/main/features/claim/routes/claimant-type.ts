import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ClaimantName } from 'app/forms/models/claimantName'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { Claimants } from 'common/router/claimants'

function renderView (form: Form<ClaimantName>, res: express.Response) {
  res.render(Paths.claimantTypePage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.claimantTypePage.uri, (req: express.Request, res: express.Response) => {
    const index = Claimants.getIndex(res)
    renderView(new Form(res.locals.user.legalClaimDraft.document.claimants[index].claimantName), res)
  })
  .post(Paths.claimantTypePage.uri, FormValidator.requestHandler(ClaimantName, ClaimantName.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<ClaimantName> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const index = Claimants.getIndex(res)
        res.locals.user.legalClaimDraft.document.claimants[index].claimantName = form.model

        await new DraftService().save(res.locals.user.legalClaimDraft, res.locals.user.bearerToken)
        res.redirect(Paths.claimantAddressPage.uri)
      }
    })
  )
