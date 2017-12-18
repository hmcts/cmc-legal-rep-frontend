import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import Summary from 'app/forms/models/summary'

import ErrorHandling from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<Summary>, res: express.Response) {
  res.render(Paths.summariseTheClaimPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.summariseTheClaimPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    renderView(new Form(draft.document.summary), res)
  })
  .post(Paths.summariseTheClaimPage.uri, FormValidator.requestHandler(Summary),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<Summary> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        draft.document.summary = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.claimAmountPage.uri)
      }
    }))
