import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import { Claimants } from 'common/router/claimants'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftView } from 'app/drafts/models/draftView'

export default express.Router()

  .get(Paths.claimantChangePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const viewDraft: Draft<DraftView> = res.locals.viewDraft

      viewDraft.document.claimantChangeIndex = Claimants.getChangeIndex(req, res)
      await new DraftService().save(viewDraft, res.locals.user.bearerToken)
      res.redirect(Claimants.getNextPage(req))

    })
  )
