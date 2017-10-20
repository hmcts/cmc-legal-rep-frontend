import * as express from 'express'
import { Paths } from 'claim/paths'
import { DraftService } from '../../../services/draftService'

export default express.Router()

  .get(Paths.startPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.startPage.associatedView)
  })

  .post(Paths.startPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      if (res.locals.user.legalClaimDraft && res.locals.user.legalClaimDraft['id']) {
        await new DraftService()['delete'](res.locals.user.legalClaimDraft['id'], res.locals.user.bearerToken)
      }

      if (res.locals.user.viewDraft && res.locals.user.viewDraft['id']) {
        await new DraftService()['delete'](res.locals.user.viewDraft['id'], res.locals.user.bearerToken)
      }
      res.redirect(Paths.representativeNamePage.uri)
    } catch (err) {
      next(err)
    }

  })
