import * as express from 'express'
import { Paths } from 'claim/paths'
import FeesClient from 'fees/feesClient'
import { Amount } from 'forms/models/amount'
import ErrorHandling from 'common/errorHandling'
import { FeeResponse } from 'fees/model/feeResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (res: express.Response, feeAmount: number, claimAmount: Amount): void {
  res.render(Paths.claimTotalPage.associatedView, {
    feeAmount: feeAmount,
    claimAmount: claimAmount
  })
}

export default express.Router()

  .get(Paths.claimTotalPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const claimAmount: Amount = draft.document.amount
      FeesClient.getFeeAmount(claimAmount)
        .then((feeResponse: FeeResponse) => {
          renderView(res, feeResponse.amount, claimAmount)
        })
        .catch(next)
    }))

  .post(Paths.claimTotalPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.detailsSummaryPage.uri)

  })
