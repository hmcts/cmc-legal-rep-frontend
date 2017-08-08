import * as express from 'express'
import { Paths } from 'claim/paths'
import { ClaimDraftMiddleware } from '../draft/claimDraftMiddleware'
import ErrorHandling from 'common/errorHandling'

export default express.Router()

  .get(Paths.claimTotalPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.claimTotalPage.associatedView, {
      feeAmount: 123,
      higherValue: 1000
    })
  })

  .post(Paths.claimTotalPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

      await ClaimDraftMiddleware.save(res, next)
      res.redirect(Paths.detailsSummaryPage.uri)

    }))
