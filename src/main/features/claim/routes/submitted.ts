import * as express from 'express'
import { Paths } from 'claim/paths'
import ErrorHandling from 'common/errorHandling'

function renderView (req: express.Request, res: express.Response, next: express.NextFunction): void {
  // TODO: The below values needs to be retrieved from claim store, should be done as part of/after ROC-1796
  const today = new Date()
  res.render(Paths.claimSubmittedPage.associatedView, {
    claimNumber: 'D99YJ987',
    submittedDate: today,
    issueDate: today,
    feePaid: '70',
    repEmail: 'test@email.com',
    externalId: 'xxxxxx'
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
