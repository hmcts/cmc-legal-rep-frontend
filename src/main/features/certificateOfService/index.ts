import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { OAuthHelper } from 'idam/oAuthHelper'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'

function certificateOfServiceRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.getRedirectUri(req, res))
  }

  const requiredRoles = ['solicitor']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/legal/certificateOfService/*', certificateOfServiceRequestHandler())
    app.all('/legal/certificateOfService/*',
      DraftMiddleware.requestHandler<DraftCertificateOfService>(new DraftService(), 'legalCertificateOfService',
        100, (value: any): DraftCertificateOfService => {
          return new DraftCertificateOfService().deserialize(value)
        }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
