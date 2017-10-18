import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'

export default express.Router()

  .get(DashboardPaths.searchPage.uri, (req: express.Request, res: express.Response) => {
    res.render(DashboardPaths.searchPage.associatedView)
  })

  .post(DashboardPaths.searchPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
      // TODO: Implement this as part of ROC-2521 also need to implement search.njk as part of ROC-2521

      res.render(DashboardPaths.searchPage.associatedView)
    } catch (err) {
      next(err)
    }

  })
