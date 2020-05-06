import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'shared/errorHandling'

import { DraftService } from 'services/draftService'
import { Claimants } from 'shared/router/claimants'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

export default express.Router()
  .get(Paths.claimantRemovePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft

      Claimants.removeClaimant(res, req.query.index as string)
      draft.document.isClaimantDeleted = true

      await new DraftService().save(draft, res.locals.user.bearerToken)

      if (draft.document.claimants.length > 0) {
        res.redirect(Paths.claimantAdditionPage.uri)
      } else {
        res.redirect(Paths.claimantTypePage.uri)
      }

    })
  )
