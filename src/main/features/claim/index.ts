import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { OAuthHelper } from 'idam/oAuthHelper'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'

function claimIssueRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.getRedirectUri(req, res))
  }

  const requiredRoles = ['solicitor']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/claim/*', claimIssueRequestHandler())
    app.all(/^\/claim\/(?!.+submitted|.+\/receipt).*$/,
      DraftMiddleware.requestHandler<DraftLegalClaim>(new DraftService(), 'legalClaim', 100, (value: any): DraftLegalClaim => {
        return new DraftLegalClaim().deserialize(value)
      }))

    app.all('/claim/start',
      DraftMiddleware.requestHandler<DraftCertificateOfService>(new DraftService(), 'legalCertificateOfService',
        100, (value: any): DraftCertificateOfService => {
          return new DraftCertificateOfService().deserialize(value)
        }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
