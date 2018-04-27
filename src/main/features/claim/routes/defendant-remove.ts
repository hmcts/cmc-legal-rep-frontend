import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'shared/errorHandling'
import { Defendants } from 'shared/router/defendants'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

export default express.Router()
  .get(Paths.defendantRemovePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft

      Defendants.removeDefendant(res, req.query.index)
      draft.document.isDefendantDeleted = true

      await new DraftService().save(draft, res.locals.user.bearerToken)

      if (draft.document.defendants.length > 0) {
        res.redirect(Paths.defendantAdditionPage.uri)
      } else {
        res.redirect(Paths.defendantTypePage.uri)
      }

    })
  )
