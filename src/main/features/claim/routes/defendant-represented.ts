import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { YesNo } from 'forms/models/yesNo'

import { DefendantRepresented } from 'forms/models/defendantRepresented'
import ErrorHandling from 'shared/errorHandling'
import { Defendants } from 'shared/router/defendants'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (form: Form<DefendantRepresented>, res: express.Response) {

  res.render(Paths.defendantRepresentedPage.associatedView, {
    form: form,
    partyStripeTitle: Defendants.getPartyStrip(res),
    partyStripeValue: Defendants.getCurrentDefendantName(res)
  })
}

export default express.Router()
  .get(Paths.defendantRepresentedPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    const index: number = Defendants.getIndex(res)
    renderView(new Form(draft.document.defendants[index].defendantRepresented), res)
  })
  .post(Paths.defendantRepresentedPage.uri, FormValidator.requestHandler(DefendantRepresented, DefendantRepresented.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const form: Form<DefendantRepresented> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const index: number = Defendants.getIndex(res)

        draft.document.defendants[index].defendantRepresented = form.model
        if (form.model.isDefendantRepresented === YesNo.NO) {
          form.model.organisationName = undefined
          draft.document.defendants[index].representative = undefined
        } else if (form.model.isDefendantRepresented === YesNo.YES) {
          draft.document.defendants[index].serviceAddress = undefined
        }

        await new DraftService().save(draft, res.locals.user.bearerToken)
        if (draft.document.defendants[index].defendantRepresented.isDefendantRepresented === YesNo.NO) {
          res.redirect(Paths.defendantServiceAddressPage.uri)
        } else {
          res.redirect(Paths.defendantRepAddressPage.uri)
        }
      }
    })
  )
