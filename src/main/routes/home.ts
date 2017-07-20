import * as express from 'express'

export default express.Router()
  .get('/', function (req: express.Request, res: express.Response) {
    res.redirect('claim/start')
  })
