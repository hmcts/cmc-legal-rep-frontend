import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Address } from 'forms/models/address'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'

function renderView (form: Form<Address>, res: express.Response): void {
  const defendants = res.locals.user.legalClaimDraft.defendants

  res.render(Paths.defendantAddressPage.associatedView, {
    form: form,
    name: Defendants.getCurrentDefendantName(res),
    defendantNumberHint: defendants.length >= 2 ? `Defendant ${defendants.length}: ` : `Defendant: `
  })
}

export default express.Router()
  .get(Paths.defendantAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.defendants[Defendants.getCurrentIndex(res)].address), res)
  })
  .post(Paths.defendantAddressPage.uri, FormValidator.requestHandler(Address, Address.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Address> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalClaimDraft.defendants[Defendants.getCurrentIndex(res)].address = form.model
        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.defendantRepresentedPage.uri)
      }
    })
  )
