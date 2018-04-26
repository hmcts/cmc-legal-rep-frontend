import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import PreferredCourt from 'app/forms/models/preferredCourt'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<PreferredCourt>, res: express.Response): void {
  res.render(Paths.preferredCourtPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.preferredCourtPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    renderView(new Form(draft.document.preferredCourt), res)
  })
  .post(Paths.preferredCourtPage.uri, FormValidator.requestHandler(PreferredCourt, PreferredCourt.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<PreferredCourt> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else if (draft.document.claimants.length > 1) {
        res.redirect(Paths.claimantAdditionPage.uri)
      } else {
        draft.document.preferredCourt = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.claimantNamePage.uri)
      }

    })
  )
