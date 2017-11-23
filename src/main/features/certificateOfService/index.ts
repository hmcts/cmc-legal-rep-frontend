import * as express from 'express'
import * as config from 'config'
import * as path from 'path'
import { Paths as AppPaths } from 'app/paths'
import * as toBoolean from 'to-boolean'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/callbackBuilder'
import { OAuthHelper } from 'idam/oAuthHelper'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import DraftUploadDocument from 'drafts/models/draftUploadDocument'

function certificateOfServiceRequestHandler (): express.RequestHandler {
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

export class Feature {
  enableFor (app: express.Express) {
    app.all('/legal/certificateOfService/*', certificateOfServiceRequestHandler())
    app.all(/^\/legal\/certificateOfService\/.*$/,
      DraftMiddleware.requestHandler<DraftCertificateOfService>(new DraftService(), 'legalCertificateOfService',
        100, (value: any): DraftCertificateOfService => {
          return new DraftCertificateOfService().deserialize(value)
        }))

    app.all(/^\/legal\/certificateOfService\/(what-documents|document-upload|file-upload)$/,
      DraftMiddleware.requestHandler<DraftUploadDocument>(new DraftService(),'legalUploadDocument',
        100, (value: any): DraftUploadDocument => {
          return new DraftUploadDocument().deserialize(value)
        }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
