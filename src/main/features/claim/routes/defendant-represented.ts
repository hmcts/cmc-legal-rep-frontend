import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { YesNo } from 'app/forms/models/yesNo'

import { DefendantRepresented } from 'app/forms/models/defendantRepresented'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

function renderView (form: Form<DefendantRepresented>, res: express.Response) {
  const defendants = res.locals.user.legalClaimDraft.defendants

  res.render(Paths.defendantRepresentedPage.associatedView, {
    form: form,
    partyStripeTitle: defendants.length >= 2 ? `Defendant ${defendants.length}` : `Defendant`,
    partyStripeValue: Defendants.getCurrentDefendantName(res)
  })
}

export default express.Router()
  .get(Paths.defendantRepresentedPage.uri, (req: express.Request, res: express.Response) => {
    const index: number = Defendants.getIndex(res)
    renderView(new Form(res.locals.user.legalClaimDraft.defendants[index].defendantRepresented), res)
  })
  .post(Paths.defendantRepresentedPage.uri, FormValidator.requestHandler(DefendantRepresented, DefendantRepresented.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantRepresented> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.isDefendantRepresented === YesNo.NO) {
          form.model.organisationName = undefined
        }
        const index: number = Defendants.getIndex(res)
        res.locals.user.legalClaimDraft.defendants[index].defendantRepresented = form.model

        await ClaimDraftMiddleware.save(res, next)

        if (res.locals.user.legalClaimDraft.defendants[index].defendantRepresented.isDefendantRepresented === YesNo.NO) {
          res.redirect(Paths.defendantServiceAddressPage.uri)
        } else {
          res.redirect(Paths.defendantRepAddressPage.uri)
        }
      }
    })
  )
