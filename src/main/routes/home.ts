import * as express from 'express'
import { Paths } from 'claim/paths'

export default express.Router()
  .get('/', function (req: express.Request, res: express.Response) {
    res.redirect(Paths.startPage.uri)
  })
