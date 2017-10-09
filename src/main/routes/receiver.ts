import * as express from 'express'
import * as config from 'config'
import { Paths as ClaimPaths } from 'claim/paths'
import { buildURL } from 'utils/callbackBuilder'
import { Paths as AppPaths } from 'app/paths'
import * as Cookies from 'cookies'
import IdamClient from 'idam/idamClient'
import { AuthToken } from 'idam/authToken'
import * as toBoolean from 'to-boolean'
import { AuthTokenRequest } from 'idam/authTokenRequest'

async function getAuthToken (req: express.Request) {
  const { code } = req.query
  const redirectUri = buildURL(req, AppPaths.receiver.uri.substring(1))
  const clientId = config.get<string>('oauth.clientId')
  const clientSecret = config.get<string>('oauth.clientSecret')
  const auth = `Basic ${new Buffer(clientId + ':' + clientSecret).toString('base64')}`
  const body = new AuthTokenRequest('authorization_code', code, redirectUri)

  return await IdamClient.createAuthToken(`${config.get('idam.api.url')}/oauth2/token`, auth, body)
}

export default express.Router()
  .get('/receiver', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

    const sessionCookie = config.get<string>('session.cookieName')
    const cookies = new Cookies(req, res)
    const useOauth = toBoolean(config.get<boolean>('featureToggles.idamOauth'))

    if (req.query.jwt) {
      cookies.set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
    } else if (useOauth) {
      const authToken: AuthToken = await getAuthToken(req)
      cookies.set(sessionCookie, authToken.accessToken, { sameSite: 'lax' })
    }

    res.redirect(ClaimPaths.startPage.uri)
  })
