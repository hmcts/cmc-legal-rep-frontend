import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import { Defendants } from 'common/router/defendants'
import { DraftService } from 'services/draftService'

export default express.Router()
  .get(Paths.defendantRemovePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

      Defendants.removeDefendant(res, req.query.index)
      await new DraftService().save(res.locals.user.legalClaimDraft, res.locals.user.bearerToken)

      res.locals.user.viewDraft.document.isDefendantDeleted = true
      await new DraftService().save(res.locals.user.viewDraft, res.locals.user.bearerToken)

      if (res.locals.user.legalClaimDraft.document.defendants.length > 0) {
        res.redirect(Paths.defendantAdditionPage.uri)
      } else {
        res.redirect(Paths.defendantTypePage.uri)
      }

    })
  )
