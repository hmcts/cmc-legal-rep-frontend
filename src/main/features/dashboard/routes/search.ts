import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'app/claims/models/claim'
import { Search } from 'forms/search'
import { Form } from 'app/forms/form'

export default express.Router()

  .get(DashboardPaths.searchPage.uri, (req: express.Request, res: express.Response) => {
    res.render(DashboardPaths.searchPage.associatedView)
  })

  .post(DashboardPaths.searchPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const form: Form<Search> = req.body
    console.log(form)
    try {
      const claim: Claim = await ClaimStoreClient.retrieveByClaimReference('000LR001', res.locals.user.bearerToken)
      console.log(claim)
      res.render(DashboardPaths.searchPage.associatedView)
    } catch (err) {
      next(err)
    }

  })
