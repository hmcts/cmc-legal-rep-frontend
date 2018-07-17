import * as express from 'express'
import { Paths as AppPaths } from 'paths'

export default express.Router()
  .get('/', function (req: express.Request, res: express.Response) {
    res.redirect(AppPaths.receiver.uri)
  })
