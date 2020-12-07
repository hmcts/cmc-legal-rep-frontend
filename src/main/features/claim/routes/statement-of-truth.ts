import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'shared/errorHandling'
import { StatementOfTruth } from 'forms/models/statementOfTruth'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<StatementOfTruth>, res: express.Response): void {
  const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
  res.render(Paths.statementOfTruthPage.associatedView, {
    form: form,
    organisationName: draft.document.representative.organisationName.name
  })
}

export default express.Router()
  .get(Paths.statementOfTruthPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    renderView(new Form(draft.document.statementOfTruth), res)
  })
  .post(Paths.statementOfTruthPage.uri, FormValidator.requestHandler(StatementOfTruth, StatementOfTruth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<StatementOfTruth> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        draft.document.statementOfTruth = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)
        process.env.PBA_ERROR_CODE = ''
        process.env.PBA_ERROR_MESSAGE = ''
        res.redirect(Paths.payByAccountPage.uri)
      }
    })
  )
