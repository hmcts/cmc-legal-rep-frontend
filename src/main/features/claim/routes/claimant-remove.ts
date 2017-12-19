import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'

import { DraftService } from 'services/draftService'
import { Claimants } from 'common/router/claimants'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'
import { DraftView } from 'app/drafts/models/draftView'

export default express.Router()
  .get(Paths.claimantRemovePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
      const viewDraft: Draft<DraftView> = res.locals.viewDraft

      Claimants.removeClaimant(res, req.query.index)
      await new DraftService().save(draft, res.locals.user.bearerToken)

      viewDraft.document.isClaimantDeleted = true
      await new DraftService().save(viewDraft, res.locals.user.bearerToken)

      if (draft.document.claimants.length > 0) {
        res.redirect(Paths.claimantAdditionPage.uri)
      } else {
        res.redirect(Paths.claimantTypePage.uri)
      }

    })
  )
