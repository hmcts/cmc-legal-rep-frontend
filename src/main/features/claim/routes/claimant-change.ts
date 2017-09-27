import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import { ViewDraftMiddleware } from 'views/draft/viewDraftMiddleware'
import { Claimants } from 'common/router/claimants'

export default express.Router()

  .get(Paths.claimantChangePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

      res.locals.user.viewDraft.claimantChangeIndex = Claimants.getChangeIndex(req, res)
      await ViewDraftMiddleware.save(res, next)
      res.redirect(Claimants.getNextPage(req))

    })
  )
