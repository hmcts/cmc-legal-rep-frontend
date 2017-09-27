import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ViewDraftMiddleware } from 'views/draft/viewDraftMiddleware'
import { Claimants } from 'common/router/claimants'

export default express.Router()
  .get(Paths.claimantRemovePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

      Claimants.removeClaimant(res, req.query.index)
      await ClaimDraftMiddleware.save(res, next)

      res.locals.user.viewDraft.isClaimantDeleted = true
      await ViewDraftMiddleware.save(res, next)

      if (res.locals.user.legalClaimDraft.claimants.length > 0) {
        res.redirect(Paths.claimantAdditionPage.uri)
      } else {
        res.redirect(Paths.claimantTypePage.uri)
      }

    })
  )
