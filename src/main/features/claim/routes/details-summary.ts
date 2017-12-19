import * as express from 'express'
import { Paths } from 'claim/paths'
import FeesClient from 'fees/feesClient'
import ErrorHandling from 'common/errorHandling'
import { Amount } from 'forms/models/amount'
import { YesNo } from 'forms/models/yesNo'
import { FeeResponse } from 'fees/model/feeResponse'
import MoneyConverter from 'fees/moneyConverter'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

function renderView (res: express.Response, next: express.NextFunction) {
  const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
  const claimAmount: Amount = draft.document.amount
  FeesClient.getFeeAmount(claimAmount)
    .then((feeResponse: FeeResponse) => {
      const isHousingDisrepair = draft.document.housingDisrepair.housingDisrepair.value === YesNo.YES.value
      const isPersonalInjury = draft.document.personalInjury.personalInjury.value === YesNo.YES.value

      res.render(Paths.detailsSummaryPage.associatedView, {
        legalClaimDraft: draft.document,
        feeAmount: MoneyConverter.convertPenniesToPounds(feeResponse.amount),
        isHousingDisrepair: isHousingDisrepair,
        isPersonalInjury: isPersonalInjury,
        paths: Paths
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
