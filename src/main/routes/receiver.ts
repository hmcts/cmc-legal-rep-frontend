import * as express from 'express'
import * as config from 'config'
import { Paths as ClaimPaths } from 'claim/paths'
import * as Cookies from 'cookies'
import { AuthToken } from 'idam/authToken'
import * as toBoolean from 'to-boolean'
import { OAuthHelper } from 'idam/oAuthHelper'
import { Paths as AppPaths } from 'paths'
import IdamClient from 'idam/idamClient'
import { buildURL } from 'utils/callbackBuilder'
import ErrorHandling from 'shared/errorHandling'

export default express.Router()
  .get('/receiver', ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

    const sessionCookie = config.get<string>('session.cookieName')
    const cookies = new Cookies(req, res)
    const useOauth = toBoolean(config.get<boolean>('featureToggles.idamOauth'))

    if (!useOauth && req.query.jwt) {
      cookies.set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
    } else if (useOauth && req.query.code) {
      cookies.set('state', '', { sameSite: 'lax' })
      if (req.query.state !== OAuthHelper.getStateCookie(req)) {
        throw new Error('Invalid state')
      }

      const authToken: AuthToken = await IdamClient.exchangeCode(req.query.code, buildURL(req, AppPaths.receiver.uri.substring(1)))
      cookies.set(sessionCookie, authToken.accessToken, { sameSite: 'lax' })
    }

    res.redirect(ClaimPaths.startPage.uri)
  }))
