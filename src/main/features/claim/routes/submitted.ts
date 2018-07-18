import * as express from 'express'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import ErrorHandling from 'shared/errorHandling'
import Claim from 'claims/models/claim'
import ClaimStoreClient from 'claims/claimStoreClient'

async function renderView (req: express.Request, res: express.Response): Promise<void> {
  const { externalId } = req.params

  const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId, res.locals.user)

  res.render(ClaimPaths.claimSubmittedPage.associatedView, {
    claim: claim,
    claimNumber: claim.claimNumber,
    feePaid: claim.claimData.feeAmountInPennies,
    repEmail: claim.submitterEmail,
    receiptPath: ClaimPaths.receiptReceiver.uri.replace(':externalId', externalId)
  })
}

export default express.Router()
  .get(ClaimPaths.claimSubmittedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      await renderView(req, res)
    }))

  .post(ClaimPaths.claimSubmittedPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(DashboardPaths.searchPage.uri)
  })
