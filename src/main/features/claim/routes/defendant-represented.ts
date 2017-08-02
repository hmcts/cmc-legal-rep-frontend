import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { YesNo } from 'app/forms/models/yesNo'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { DefendantRepresented } from 'app/forms/models/defendantRepresented'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<DefendantRepresented>, res: express.Response) {
  res.render(Paths.defendantRepresentedPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.defendantRepresentedPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.defendant.defendantRepresented), res)
  })
  .post(Paths.defendantRepresentedPage.uri, FormValidator.requestHandler(DefendantRepresented, DefendantRepresented.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantRepresented> = req.body

      if (form.model.isDefendantRepresented === YesNo.NO) {
        form.model.companyName = undefined
      }

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalClaimDraft.defendant.defendantRepresented = form.model

        await ClaimDraftMiddleware.save(res, next)

        if (res.locals.user.legalClaimDraft.defendant.defendantRepresented.isDefendantRepresented === YesNo.NO) {
          res.redirect(Paths.personalInjuryPage.uri)
        } else {
          res.redirect(Paths.defendantRepAddressPage.uri)
        }
      }
    })
  )
