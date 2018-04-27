import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { YourReference } from 'forms/models/yourReference'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<YourReference>, res: express.Response) {
  res.render(Paths.yourReferencePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.yourReferencePage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    renderView(new Form(draft.document.yourReference), res)
  })
  .post(Paths.yourReferencePage.uri, FormValidator.requestHandler(YourReference, YourReference.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<YourReference> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        draft.document.yourReference = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.preferredCourtPage.uri)
      }
    })
  )
