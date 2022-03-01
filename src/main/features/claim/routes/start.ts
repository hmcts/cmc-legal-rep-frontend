import * as express from 'express'
import { Paths } from 'claim/paths'

export default express.Router()

  .get(Paths.startPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect('https://www.gov.uk/government/publications/myhmcts-how-to-make-a-damages-claim-online/issue-a-claim-for-damages-with-myhmcts') // redirect LRPB issue claim page to issue damages claims page
  })
