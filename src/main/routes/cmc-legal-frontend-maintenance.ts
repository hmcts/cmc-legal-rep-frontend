import * as express from 'express'

import { Paths } from 'paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.cmcLegalFrontendMaintenancePage.uri,
    (req: express.Request, res: express.Response) => {
      res.render(Paths.cmcLegalFrontendMaintenancePage.associatedView)
    })
