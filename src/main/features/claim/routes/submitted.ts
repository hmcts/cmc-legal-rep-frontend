import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'shared/errorHandling'
import Claim from 'claims/models/claim'
import ClaimStoreClient from 'claims/claimStoreClient'

async function renderView (req: express.Request, res: express.Response): Promise<void> {
  const { externalId } = req.params

  const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId, res.locals.user)

  res.render(Paths.claimSubmittedPage.associatedView, {
    claim: claim,
    claimNumber: claim.claimNumber,
    feePaid: claim.claimData.feeAmountInPennies,
    repEmail: claim.submitterEmail,
    receiptPath: Paths.receiptReceiver.uri.replace(':externalId', externalId)
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
