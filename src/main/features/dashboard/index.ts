import * as express from 'express'
import * as config from 'config'
import * as path from 'path'
import { Paths as AppPaths } from 'app/paths'
import * as toBoolean from 'to-boolean'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/callbackBuilder'
import { OAuthHelper } from 'idam/oAuthHelper'
import { DraftMiddleware } from 'common/draft/draftMiddleware'
import { DraftDashboard } from 'drafts/models/draftDashboard'

function dashboardRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    const redirectUri = buildURL(req, AppPaths.receiver.uri.substring(1))
    const useOauth = toBoolean(config.get<boolean>('featureToggles.idamOauth'))

    res.redirect(useOauth
      ? OAuthHelper.getRedirectUri(req, res)
      : `${config.get('idam.authentication-web.url')}/login?continue-url=${redirectUri}`)
  }

  const requiredRoles = ['solicitor']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class DashboardFeature {
  enableFor (app: express.Express) {
    app.all(/^\/(legal\/dashboard.*)$/, dashboardRequestHandler())

    app.all(/^\/legal\/dashboard.*$/, DraftMiddleware.requestHandler<DraftDashboard>('dashboardDaft',
      (value: any): DraftDashboard => {
        return new DraftDashboard().deserialize(value)
      }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
