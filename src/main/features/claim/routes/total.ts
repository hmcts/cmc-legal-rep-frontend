import * as express from 'express'
import { Paths } from 'claim/paths'
import FeesClient from 'fees/feesClient'
import { Amount } from 'forms/models/amount'
import ErrorHandling from 'common/errorHandling'
import { Fee } from 'fees/fee'

function renderView (res: express.Response, feeAmount: number, claimAmount: Amount): void {
  res.render(Paths.claimTotalPage.associatedView, {
    feeAmount: feeAmount,
    claimAmount: claimAmount
  })
}

export default express.Router()

  .get(Paths.claimTotalPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

      const claimAmount: Amount = res.locals.user.legalClaimDraft.amount
      FeesClient.getFeeAmount(claimAmount)
        .then((fee: Fee) => {
          renderView(res, fee.amount, claimAmount)
        })
        .catch(next)
    }))

  .post(Paths.claimTotalPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.detailsSummaryPage.uri)

  })
