import * as express from 'express'
import { Paths } from 'claim/paths'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ViewDraftMiddleware } from 'views/draft/viewDraftMiddleware'

export default express.Router()

  .get(Paths.startPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.startPage.associatedView)
  })

  .post(Paths.startPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      await ClaimDraftMiddleware.delete(res, next)
      await ViewDraftMiddleware.delete(res, next)
      res.redirect(Paths.representativeNamePage.uri)
    } catch (err) {
      next(err)
    }

  })
