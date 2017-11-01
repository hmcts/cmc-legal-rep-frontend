import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'app/claims/models/claim'
import ErrorHandling from 'common/errorHandling'

async function renderView (req: express.Request, res: express.Response): Promise<void> {

  try {
    const claim: Claim = await ClaimStoreClient.retrieveByClaimReference(res.locals.user.dashboardDaft.document.search.reference, res.locals.user.bearerToken)
    console.log(claim)
    res.render(DashboardPaths.claimDetailsPage.associatedView, {
      claimNumber: claim.claimNumber
    })
  } catch (err) {
    throw err
  }
}

export default express.Router()

  .get(DashboardPaths.claimDetailsPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    await renderView(req, res)
  }))

  .post(DashboardPaths.claimDetailsPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    // TODO implement confirm service journey

  })
