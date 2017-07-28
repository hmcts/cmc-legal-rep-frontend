import * as express from 'express'

import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { YesNo } from 'app/forms/models/yesNo'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { DefendantRepresented } from 'app/forms/models/defendantRepresented'

function renderView (form: Form<DefendantRepresented>, res: express.Response) {
  res.render(Paths.defendantRepresentedPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantRepresentedPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.claimDraft.defendant.defendantRepresented), res)
  })
  .post(Paths.defendantRepresentedPage.uri, FormValidator.requestHandler(DefendantRepresented, DefendantRepresented.fromObject), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<DefendantRepresented> = req.body

    if (form.model.isDefendantRepresented === YesNo.NO) {
      form.model.companyName = undefined
    }

    if (form.hasErrors()) {
      renderView(form, res)
    } else {
      res.locals.user.claimDraft.defendant.defendantRepresented = form.model

      ClaimDraftMiddleware.save(res, next)
        .then(() => {
          res.redirect(Paths.defendantRepAddressPage.uri)
        })
    }
  })
