import * as express from 'express'
import * as config from 'config'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { buildURL } from 'utils/CallbackBuilder'

export class AuthorizationMiddlewareFactory {

  static genericRequestHandler (): express.RequestHandler {
    function accessDeniedCallback (req: express.Request, res: express.Response): void {
      res.redirect(`${config.get('idam.authentication-web.url')}/login?continue-url=${buildURL(req, 'receiver')}`)
    }
    const unprotectedPaths = [
      '/receiver',
      '/health',
      '/version',
      '/analytics'
    ]
    return AuthorizationMiddleware.requestHandler('citizen', accessDeniedCallback, unprotectedPaths)
  }
}
