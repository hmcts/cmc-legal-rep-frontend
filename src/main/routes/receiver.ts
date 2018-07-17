import * as express from 'express'
import * as config from 'config'
import { Paths as ClaimPaths } from 'claim/paths'
import * as Cookies from 'cookies'
import { AuthToken } from 'idam/authToken'
import { OAuthHelper } from 'idam/oAuthHelper'
import { Paths as AppPaths } from 'paths'
import IdamClient from 'idam/idamClient'
import { buildURL } from 'utils/callbackBuilder'
import ErrorHandling from 'shared/errorHandling'
import * as appInsights from 'applicationinsights'

export default express.Router()
  .get('/receiver', ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

    const sessionCookie = config.get<string>('session.cookieName')
    const cookies = new Cookies(req, res)

    if (req.query.code) {
      cookies.set('state', '', { sameSite: 'lax' })
      if (req.query.state !== OAuthHelper.getStateCookie(req)) {
        appInsights.defaultClient.trackEvent({
          name: 'State cookie mismatch (legal)',
          properties: {
            requestValue: req.query.state,
            cookieValue: OAuthHelper.getStateCookie(req)
          }
        })
      }

      const authToken: AuthToken = await IdamClient.exchangeCode(req.query.code, buildURL(req, AppPaths.receiver.uri.substring(1)))
      cookies.set(sessionCookie, authToken.accessToken, { sameSite: 'lax' })
    }

    res.redirect(ClaimPaths.startPage.uri)
  }))
