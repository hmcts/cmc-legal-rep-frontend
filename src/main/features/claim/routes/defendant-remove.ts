import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'
import { DraftView } from 'app/drafts/models/draftView'

export default express.Router()
  .get(Paths.defendantRemovePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const viewDraft: Draft<DraftView> = res.locals.viewDraft

      Defendants.removeDefendant(res, req.query.index)
      await new DraftService().save(draft, res.locals.user.bearerToken)

      viewDraft.document.isDefendantDeleted = true
      await new DraftService().save(viewDraft, res.locals.user.bearerToken)

      if (draft.document.defendants.length > 0) {
        res.redirect(Paths.defendantAdditionPage.uri)
      } else {
        res.redirect(Paths.defendantTypePage.uri)
      }

    })
  )
