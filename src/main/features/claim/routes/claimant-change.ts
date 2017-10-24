import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import { Claimants } from 'common/router/claimants'
import { DraftService } from '../../../services/draftService'

export default express.Router()

  .get(Paths.claimantChangePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

      res.locals.user.viewDraft.document.claimantChangeIndex = Claimants.getChangeIndex(req, res)
      await new DraftService().save(res.locals.user.viewDraft, res.locals.user.bearerToken)
      res.redirect(Claimants.getNextPage(req))

    })
  )
