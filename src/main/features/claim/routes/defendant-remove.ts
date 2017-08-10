import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

export default express.Router()
  .get(Paths.defendantRemovePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

      Defendants.removeDefendant(res, req.query.index)
      await ClaimDraftMiddleware.save(res, next)
      res.redirect(Paths.defendantAdditionPage.uri)

    })
  )
