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
import ClaimStoreClient from 'claims/claimStoreClient'
import { RoutablePath } from 'shared/router/routablePath'
import JwtExtractor from 'idam/jwtExtractor'
import { FeatureToggles } from 'utils/featureToggles'
import { Paths as DashboardPaths } from 'dashboard/paths'

async function getOAuthAccessToken (req: express.Request, receiver: RoutablePath): Promise<string> {
  if (req.query.state !== OAuthHelper.getStateCookie(req)) {
    appInsights.defaultClient.trackEvent({
      name: 'State cookie mismatch (citizen)',
      properties: {
        requestValue: req.query.state,
        cookieValue: OAuthHelper.getStateCookie(req)
      }
    })
  }

  const authToken: AuthToken = await IdamClient.exchangeCode(
    req.query.code,
    buildURL(req, receiver.uri)
  )
  return authToken.accessToken
}

async function getAuthToken (req: express.Request,
                             receiver: RoutablePath = AppPaths.receiver,
                             checkCookie = true): Promise<string> {
  let authenticationToken
  if (req.query.code) {
    authenticationToken = await getOAuthAccessToken(req, receiver)
  } else if (checkCookie) {
    authenticationToken = JwtExtractor.extract(req)
  }
  return authenticationToken
}

function setAuthCookie (cookies: Cookies, authenticationToken: string): void {
  const sessionCookie = config.get<string>('session.cookieName')

  cookies.set(sessionCookie, authenticationToken, { sameSite: 'lax' })
  cookies.set('state', '', { sameSite: 'lax' })
}

export default express.Router()
  .get('/receiver', ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const cookies = new Cookies(req, res)

    const authenticationToken: string = await getAuthToken(req)
    let user
    if (authenticationToken) {
      user = await IdamClient.retrieveUserFor(authenticationToken)
      res.locals.isLoggedIn = true
      res.locals.user = user
      setAuthCookie(cookies, authenticationToken)
    }

    if (res.locals.isLoggedIn) {
      const hasClaims = (await ClaimStoreClient.getBySubmitterId(user)).length > 0
      if (hasClaims && FeatureToggles.isEnabled('dashboard')) {
        res.redirect(DashboardPaths.searchPage.uri)
      } else {
        res.redirect(ClaimPaths.startPage.uri)
      }
    } else {
      res.redirect(OAuthHelper.getRedirectUri(req, res))
    }
  }))
