import * as express from 'express'
import * as config from 'config'
import * as path from 'path'
import { Paths as AppPaths } from 'app/paths'
import * as uuid from 'uuid'
import * as toBoolean from 'to-boolean'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/callbackBuilder'
import { ViewDraftMiddleware } from 'views/draft/viewDraftMiddleware'

function claimIssueRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    const clientId = config.get<string>('oauth.clientId')
    const redirectUri = buildURL(req, AppPaths.receiver.uri.substring(1))
    const state = uuid()

    const idamUrlWithOauth = `${config.get('idam.authentication-web.url')}/login?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
    const idamUrlWithoutOauth = `${config.get('idam.authentication-web.url')}/login?continue-url=${redirectUri}`

    const useOauth = toBoolean(config.get<boolean>('featureToggles.idamOauth'))
    console.log(useOauth)
    res.redirect(useOauth ? idamUrlWithOauth : idamUrlWithoutOauth)
  }

  const requiredRoles = ['solicitor']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/legal/claim/*', claimIssueRequestHandler())
    app.all(/^\/legal\/claim\/(?!start|.+\/submitted|.+\/receipt).*$/, ClaimDraftMiddleware.retrieve)
    app.all(/^\/legal\/claim\/(claimant)-(add|remove|address|type|change)$/, ViewDraftMiddleware.retrieve)
    app.all(/^\/legal\/claim\/(defendant)-.*$/, ViewDraftMiddleware.retrieve)

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
