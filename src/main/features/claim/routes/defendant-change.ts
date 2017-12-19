import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

export default express.Router()

  .get(Paths.defendantChangePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft

      draft.document.defendantChangeIndex = Defendants.getChangeIndex(req, res)
      await new DraftService().save(draft, res.locals.user.bearerToken)
      res.redirect(Defendants.getNextPage(req))

    })
  )
