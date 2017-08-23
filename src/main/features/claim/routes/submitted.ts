import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'
import Claim from 'claims/models/claim'
import ClaimStoreClient from 'claims/claimStoreClient'

function renderView (req: express.Request, res: express.Response, next: express.NextFunction): void {
  const { externalId } = req.params

  const claim: Claim = ClaimStoreClient.retrieveByExternalId(externalId)
  // TODO: The below values needs to be retrieved from claim store, should be done as part of/after ROC-1796
  const today = new Date()
  res.render(Paths.claimSubmittedPage.associatedView, {
    claimNumber: claim.claimNumber,
    submittedDate: ,
    issueDate: today,
    feePaid: '70',
    repEmail: 'test@email.com',
    externalId: externalId
  })
}

export default express.Router()
  .get(Paths.claimSubmittedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      renderView(req, res, next)
    }))

  .post(Paths.claimSubmittedPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.startPage.uri)
  })
