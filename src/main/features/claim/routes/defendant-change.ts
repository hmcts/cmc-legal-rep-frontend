import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftView } from 'app/drafts/models/draftView'

export default express.Router()

  .get(Paths.defendantChangePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const viewDraft: Draft<DraftView> = res.locals.viewDraft

      viewDraft.document.defendantChangeIndex = Defendants.getChangeIndex(req, res)
      await new DraftService().save(viewDraft, res.locals.user.bearerToken)
      res.redirect(Defendants.getNextPage(req))

    })
  )
