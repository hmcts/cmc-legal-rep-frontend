import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'app/claims/models/claim'
import ErrorHandling from 'common/errorHandling'
import { Paths } from 'claim/paths'
import { Draft } from '@hmcts/draft-store-client'
import { DraftDashboard } from 'drafts/models/draftDashboard'

async function renderView (req: express.Request, res: express.Response): Promise<void> {
  const dashboardDraft: Draft<DraftDashboard> = res.locals.dashboardDraft
  const claim: Claim = await ClaimStoreClient.retrieveByClaimReference(dashboardDraft.document.search.reference, res.locals.user.bearerToken)
  res.render(DashboardPaths.claimDetailsPage.associatedView, {
    claimNumber: claim.claimNumber,
    partyStripeValue: claim.claimNumber,
    claimantVDefendant: `${claim.claimData.primaryClaimant.name} v ${claim.claimData.primaryDefendant.name}`,
    dateIssued: claim.issuedOn,
    claimants: claim.claimData.claimants,
    defendants: claim.claimData.defendants,
    externalReference: claim.claimData.externalReferenceNumber,
    sealedClaimPath: Paths.receiptReceiver.uri.replace(':externalId', claim.externalId)
  })
}

export default express.Router()

  .get(DashboardPaths.claimDetailsPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    await renderView(req, res)
  }))
