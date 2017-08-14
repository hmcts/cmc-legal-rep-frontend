import * as express from 'express'
import { Paths } from 'claim/paths'
import { Paths as AppPaths } from 'app/paths'

export default express.Router()
  .get(AppPaths.homePage.uri, function (req: express.Request, res: express.Response) {
    res.redirect(Paths.startPage.uri)
  })
  .get('/', function (req: express.Request, res: express.Response) {
    res.redirect(Paths.startPage.uri)
  })
