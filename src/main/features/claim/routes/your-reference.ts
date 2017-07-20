import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { YourReference } from 'app/forms/models/yourReference'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

function renderView (form: Form<YourReference>, res: express.Response) {
  res.render(Paths.yourReferencePage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.yourReferencePage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.yourReference), res)
  })
  .post(Paths.yourReferencePage.uri, FormValidator.requestHandler(YourReference, YourReference.fromObject), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<YourReference> = req.body

    if (form.hasErrors()) {
      renderView(form, res)
    } else {
      res.locals.user.claimDraft.yourReference = form.model
      ClaimDraftMiddleware.save(res, next)
        .then(() => {
          res.redirect(Paths.personalInjuryPage.uri)
        })
    }
  })
