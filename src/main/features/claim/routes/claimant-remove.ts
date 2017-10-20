import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'

import { DraftService } from 'services/draftService'
import { Claimants } from 'common/router/claimants'

export default express.Router()
  .get(Paths.claimantRemovePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

      Claimants.removeClaimant(res, req.query.index)
      await new DraftService()['save'](res.locals.user.legalClaimDraft, res.locals.user.bearerToken)

      res.locals.user.viewDraft.document.isClaimantDeleted = true
      await new DraftService()['save'](res.locals.user.viewDraft, res.locals.user.bearerToken)

      if (res.locals.user.legalClaimDraft.document.claimants.length > 0) {
        res.redirect(Paths.claimantAdditionPage.uri)
      } else {
        res.redirect(Paths.claimantTypePage.uri)
      }

    })
  )
