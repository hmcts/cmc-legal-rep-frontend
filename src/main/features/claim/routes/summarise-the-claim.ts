import * as express from 'express'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import Summary from 'app/forms/models/summary'

import { ClaimDraftMiddleware } from '../draft/claimDraftMiddleware'
import { Paths } from 'claim/paths'

function renderView (form: Form<Summary>, res: express.Response) {
  res.render(Paths.summariseTheClaimPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.summariseTheClaimPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.summary), res)
  })
  .post(Paths.summariseTheClaimPage.uri, FormValidator.requestHandler(Summary), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<Summary> = req.body

    if (form.hasErrors()) {
      renderView(form, res)
    } else {
      res.locals.user.claimDraft.summary = form.model

      ClaimDraftMiddleware.save(res, next)
        .then(() => res.redirect('/not-implemented-yet'))
    }
  })
