import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'

export default express.Router()

  .get(DashboardPaths.claimDetailsPage.uri, (req: express.Request, res: express.Response) => {
    res.render(DashboardPaths.claimDetailsPage.associatedView)
  })
  .post(DashboardPaths.claimDetailsPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    // TODO implement confirm service journey

  })
