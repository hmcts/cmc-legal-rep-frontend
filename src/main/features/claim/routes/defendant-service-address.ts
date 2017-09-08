import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { YesNo } from 'app/forms/models/yesNo'

import { ServiceAddress } from 'app/forms/models/serviceAddress'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

function renderView (form: Form<ServiceAddress>, res: express.Response) {
  const defendants = res.locals.user.legalClaimDraft.defendants

  res.render(Paths.defendantServiceAddressPage.associatedView, {
    form: form,
    partyStripeTitle: defendants.length >= 2 ? `Defendant ${defendants.length}` : `Defendant`,
    partyStripeValue: Defendants.getCurrentDefendantName(res),
    defendantsAddress: res.locals.user.legalClaimDraft.defendants[Defendants.getCurrentIndex(res)].address
  })
}

export default express.Router()
  .get(Paths.defendantServiceAddressPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.defendants[Defendants.getCurrentIndex(res)].serviceAddress), res)
  })
  .post(Paths.defendantServiceAddressPage.uri, FormValidator.requestHandler(ServiceAddress, ServiceAddress.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<ServiceAddress> = req.body
      console.log(form)

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.defendantsAddress === YesNo.YES) {
          form.model.line1 = undefined
          form.model.line2 = undefined
          form.model.city = undefined
          form.model.postcode = undefined
        }

        res.locals.user.legalClaimDraft.defendants[Defendants.getCurrentIndex(res)].serviceAddress = form.model

        await ClaimDraftMiddleware.save(res, next)

        res.redirect(Paths.defendantAdditionPage.uri)
      }
    })
  )
