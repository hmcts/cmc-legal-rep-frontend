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
import * as HttpStatus from 'http-status-codes'
import { Logger } from '@hmcts/nodejs-logging'

const sessionCookie = config.get<string>('session.cookieName')
const logger = Logger.getLogger('receiver')

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
  cookies.set(sessionCookie, authenticationToken, { sameSite: 'lax' })
  cookies.set('state', '', { sameSite: 'lax' })
}

/**
 * IDAM doesn't tell us what is wrong
 * But most likely if we get 401 or 403 then the user's token has expired
 * So make them login again
 */
export function hasTokenExpired (err) {
  return (err.statusCode === HttpStatus.FORBIDDEN || err.statusCode === HttpStatus.UNAUTHORIZED)
}

function loginErrorHandler (
  req: express.Request,
  res: express.Response,
  cookies: Cookies,
  next: express.NextFunction,
  err: Error
) {
  if (hasTokenExpired(err)) {
    cookies.set(sessionCookie, '', { sameSite: 'lax' })
    logger.debug(`Protected path - expired auth token - access to ${req.path} rejected`)
    return res.redirect(OAuthHelper.getRedirectUri(req, res))
  }
  cookies.set('state', '', { sameSite: 'lax' })
  return next(err)
}

export default express.Router()
  .get('/receiver', ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const cookies = new Cookies(req, res)

    let user
    try {
      const authenticationToken: string = await getAuthToken(req)
      if (authenticationToken) {
        user = await IdamClient.retrieveUserFor(authenticationToken)
        res.locals.isLoggedIn = true
        res.locals.user = user
        setAuthCookie(cookies, authenticationToken)
      }
    } catch (err) {
      return loginErrorHandler(req, res, cookies, next, err)
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
