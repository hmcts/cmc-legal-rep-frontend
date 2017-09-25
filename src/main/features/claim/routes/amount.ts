import * as express from 'express'
import { Paths } from 'claim/paths'

import { Form } from 'forms/form'
import { Amount } from 'app/forms/models/amount'
import { Fee } from 'fees/fee'
import { FormValidator } from 'forms/validation/formValidator'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'
import MoneyConverter from 'app/fees/moneyConverter'
import FeesClient from 'fees/feesClient'

function renderView (form: Form<Amount>, res: express.Response): void {
  res.render(Paths.claimAmountPage.associatedView, {
    form: form
  })
}

export default express.Router()
  .get(Paths.claimAmountPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalClaimDraft.amount), res)
  })
  .post(Paths.claimAmountPage.uri, FormValidator.requestHandler(Amount, Amount.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Amount> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (form.model.cannotState === Amount.CANNOT_STATE_VALUE) {
          form.model.higherValue = undefined
          form.model.lowerValue = undefined
        } else {
          form.model.cannotState = undefined
        }

        const fee: Fee = await FeesClient.getFeeAmount(form.model)
        res.locals.user.legalClaimDraft.feeAmountInPennies = MoneyConverter.convertPoundsToPennies(fee.amount)
        res.locals.user.legalClaimDraft.feeCode = fee.code
        res.locals.user.legalClaimDraft.amount = form.model

        await ClaimDraftMiddleware.save(res, next)
        res.redirect(Paths.claimTotalPage.uri)
      }
    })
  )
