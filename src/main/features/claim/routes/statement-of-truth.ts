import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'
import { StatementOfTruth } from 'app/forms/models/statementOfTruth'

function renderView (form: Form<StatementOfTruth>, res: express.Response): void {
  res.render(Paths.statementOfTruthPage.associatedView, {
    form: form,
    organisationName: res.locals.user.legalClaimDraft.document.representative.organisationName.name
  })
}

export default express.Router()
  .get(Paths.statementOfTruthPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.document.statementOfTruth), res)
  })
  .post(Paths.statementOfTruthPage.uri, FormValidator.requestHandler(StatementOfTruth, StatementOfTruth.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<StatementOfTruth> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalClaimDraft.document.statementOfTruth = form.model
        await new DraftService()['save'](res.locals.user.legalClaimDraft, res.locals.user.bearerToken)
        res.redirect(Paths.payByAccountPage.uri)
      }
    })
  )
