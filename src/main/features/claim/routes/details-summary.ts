import * as express from 'express'
import { Paths } from 'claim/paths'
import FeesClient from 'fees/feesClient'
import ErrorHandling from 'common/errorHandling'
import { Amount } from 'forms/models/amount'
import { PartyTypes } from 'app/forms/models/partyTypes'

function renderView (res: express.Response, next: express.NextFunction) {
  const claimAmount: Amount = res.locals.user.legalClaimDraft.amount
  FeesClient.getFeeAmount(claimAmount)
    .then((feeAmount: number) => {
      const claimant = res.locals.user.legalClaimDraft.claimant
      const isClaimantIndividual = claimant.claimantDetails.type.value === PartyTypes.INDIVIDUAL.value
      res.render(Paths.detailsSummaryPage.associatedView, {
        legalClaimDraft: res.locals.user.legalClaimDraft,
        feeAmount: feeAmount,
        isClaimantIndividual: isClaimantIndividual
      })
    })
    .catch(next)
}

export default express.Router()
  .get(Paths.detailsSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      renderView(res, next)
    }))

  .post(Paths.detailsSummaryPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.statementOfTruthPage.uri)
  })
