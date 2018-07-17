import * as express from 'express'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Search } from 'forms/models/search'
import { Form, FormValidationError } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import ErrorHandling from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftDashboard } from 'drafts/models/draftDashboard'
import ClaimStoreClient from 'claims/claimStoreClient'
import * as HttpStatus from 'http-status-codes'

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

      function createFormValidationError (content: string): FormValidationError {
        return new FormValidationError({
          property: 'reference',
          constraints: {
            matches: content
          },
          target: form.model,
          value: form.model.reference,
          children: []
        })
      }

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        dashboardDraft.document.search = form.model
        try {
          await ClaimStoreClient
            .retrieveByClaimReference(dashboardDraft.document.search.reference, res.locals.user.bearerToken)
        } catch (err) {
          if (err.statusCode === HttpStatus.NOT_FOUND) {
            form.errors.push(createFormValidationError('Placeholder content: Claim not found'))
          } else {
            return next(err)
          }

          return renderView(form, res)
        }

        await new DraftService().save(dashboardDraft, res.locals.user.bearerToken)
        res.redirect(DashboardPaths.claimDetailsPage.uri)
      }
    }))
