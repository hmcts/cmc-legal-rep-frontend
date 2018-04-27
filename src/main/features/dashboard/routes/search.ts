import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Search } from 'forms/models/search'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import ErrorHandling from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftDashboard } from 'drafts/models/draftDashboard'

function renderView (form: Form<Search>, res: express.Response) {
  res.render(DashboardPaths.searchPage.associatedView, {
    form: form,
    startPage: ClaimPaths.startPage.uri
  })
}

export default express.Router()

  .get(DashboardPaths.searchPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(new Search()), res)
  })

  .post(DashboardPaths.searchPage.uri, FormValidator.requestHandler(Search, Search.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const dashboardDraft: Draft<DraftDashboard> = res.locals.dashboardDraft
      const form: Form<Search> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        dashboardDraft.document.search = form.model
        await new DraftService().save(dashboardDraft, res.locals.user.bearerToken)
        res.redirect(DashboardPaths.claimDetailsPage.uri)
      }
    }))
