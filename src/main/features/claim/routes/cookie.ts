import * as express from 'express'
import { Paths } from 'claim/paths'

export default express.Router()
  .get(Paths.cookiePage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.cookiePage.associatedView)
  })
  .post(Paths.cookiePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    res.redirect(Paths.startPage.uri)
  })
