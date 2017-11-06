import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Search } from 'forms/models/search'
import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import ErrorHandling from 'common/errorHandling'
import { DraftService } from 'services/draftService'

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
        res.locals.user.dashboardDraft.document.search = form.model
        await new DraftService().save(res.locals.user.dashboardDraft, res.locals.user.bearerToken)
        res.redirect(DashboardPaths.claimDetailsPage.uri)
      }
    }))
