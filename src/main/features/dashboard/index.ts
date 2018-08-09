import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { OAuthHelper } from 'idam/oAuthHelper'
import { DraftDashboard } from 'drafts/models/draftDashboard'
import { DraftService } from 'services/draftService'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'

function dashboardRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.getRedirectUri(req, res))
  }

  const requiredRoles = ['solicitor']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class DashboardFeature {
  enableFor (app: express.Express) {
    app.all('/dashboard*', dashboardRequestHandler())

    app.all('/dashboard*',
      DraftMiddleware.requestHandler<DraftDashboard>(new DraftService(), 'dashboard', 100, (value: any): DraftDashboard => {
        return new DraftDashboard().deserialize(value)
      }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
