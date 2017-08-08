import * as express from 'express'
import { Paths } from 'claim/paths'
import FeesClient from 'fees/feesClient'

export default express.Router()

  .get(Paths.claimTotalPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const claimHigherValue = 100000
    await FeesClient.calculateIssueFee(claimHigherValue)
      .then((feeAmount: number) => {
        res.render(Paths.claimTotalPage.associatedView, {
          feeAmount: feeAmount,
          higherValue: claimHigherValue
        })
      })
      .catch(next)
  })

  .post(Paths.claimTotalPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.detailsSummaryPage.uri)

  })
