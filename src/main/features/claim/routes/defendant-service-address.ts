import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { YesNo } from 'app/forms/models/yesNo'

import { ServiceAddress } from 'app/forms/models/serviceAddress'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { DraftService } from 'services/draftService'

function renderView (form: Form<ServiceAddress>, res: express.Response) {
  const defendants = res.locals.user.legalClaimDraft.document.defendants

  res.render(Paths.defendantServiceAddressPage.associatedView, {
    form: form,
    partyStripeTitle: Defendants.getPartyStrip(res),
    partyStripeValue: Defendants.getCurrentDefendantName(res),
    defendantsAddress: defendants[Defendants.getIndex(res)].address.toString()
  })
}

export default express.Router()
  .get(Paths.defendantServiceAddressPage.uri, (req: express.Request, res: express.Response) => {
    const index: number = Defendants.getIndex(res)
    renderView(new Form(res.locals.user.legalClaimDraft.document.defendants[index].serviceAddress), res)
  })
  .post(Paths.defendantServiceAddressPage.uri, FormValidator.requestHandler(ServiceAddress, ServiceAddress.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<ServiceAddress> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.defendantsAddress === YesNo.YES) {
          form.model.line1 = undefined
          form.model.line2 = undefined
          form.model.city = undefined
          form.model.postcode = undefined
        }
        const index: number = Defendants.getIndex(res)
        res.locals.user.legalClaimDraft.document.defendants[index].serviceAddress = form.model
        res.locals.user.viewDraft.document.defendantChangeIndex = undefined
        await new DraftService()['save'](res.locals.user.viewDraft, res.locals.user.bearerToken)
        await new DraftService()['save'](res.locals.user.legalClaimDraft, res.locals.user.bearerToken)
        res.redirect(Paths.defendantAdditionPage.uri)
      }
    })
  )
