import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { ViewDraftMiddleware } from 'views/draft/viewDraftMiddleware'

export default express.Router()

  .get(Paths.defendantChangePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

      res.locals.user.viewDraft.defendantChangeIndex = Defendants.getChangeIndex(req, res)
      await ViewDraftMiddleware.save(res, next)
      res.redirect(Defendants.getNextPage(req))

    })
  )
