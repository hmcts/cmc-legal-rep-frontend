import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { YourReference } from 'app/forms/models/yourReference'

import { DraftService } from 'services/draftService'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<YourReference>, res: express.Response) {
  res.render(Paths.yourReferencePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.yourReferencePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.document.yourReference), res)
  })
  .post(Paths.yourReferencePage.uri, FormValidator.requestHandler(YourReference, YourReference.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<YourReference> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalClaimDraft.document.yourReference = form.model
        await new DraftService().save(res.locals.user.legalClaimDraft, res.locals.user.bearerToken)
        res.redirect(Paths.preferredCourtPage.uri)
      }
    })
  )
