import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import Claim from 'claims/models/claim'
import ClaimStoreClient from 'claims/claimStoreClient'

async function renderView (req: express.Request, res: express.Response): Promise<void> {
  const { externalId } = req.params

  const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId)
  res.render(Paths.claimSubmittedPage.associatedView, {
    claimNumber: claim.claimNumber,
    submittedDate: claim.createdAt,
    issueDate: claim.issuedOn,
    feePaid: claim.claimData.paidFeeAmount,
    repEmail: claim.claimantEmail,
    externalId: externalId
  })
}

export default express.Router()
  .get(Paths.claimSubmittedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      await renderView(req, res)
    }))

  .post(Paths.claimSubmittedPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.startPage.uri)
  })
