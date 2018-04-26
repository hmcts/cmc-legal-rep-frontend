import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ClaimantName } from 'app/forms/models/claimantName'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { Claimants } from 'common/router/claimants'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<ClaimantName>, res: express.Response) {
  res.render(Paths.claimantNamePage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.claimantNamePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    const index = Claimants.getIndex(res)
    renderView(new Form(draft.document.claimants[index].claimantName), res)
  })
  .post(Paths.claimantNamePage.uri, FormValidator.requestHandler(ClaimantName, ClaimantName.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<ClaimantName> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const index = Claimants.getIndex(res)
        draft.document.claimants[index].claimantName = form.model

        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.claimantAddressPage.uri)
      }
    })
  )
