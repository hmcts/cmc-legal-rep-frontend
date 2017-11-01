import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'
import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'app/claims/models/claim'
import { Search } from 'forms/search'
import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<Search>, res: express.Response) {
  res.render(DashboardPaths.searchPage.associatedView, {
    form: form
  })
}

export default express.Router()

  .get(DashboardPaths.searchPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(new Search()), res)
  })

  .post(DashboardPaths.searchPage.uri, FormValidator.requestHandler(Search, Search.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Search> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        try {
          const claim: Claim = await ClaimStoreClient.retrieveByClaimReference(form.model.reference, res.locals.user.bearerToken)
          console.log(claim)
          res.render(DashboardPaths.searchPage.associatedView)
        } catch (err) {
          next(err)
        }
      }
    }))
