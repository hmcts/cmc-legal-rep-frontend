import * as express from 'express'
import * as config from 'config'
import { Paths } from 'paths'

export default express.Router()
  .get(Paths.analyticsReceiver.uri, (req: express.Request, res: express.Response) => {
    const site = config.get('legal_frontend_analytics')

    res.json(site)
  })
