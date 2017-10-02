import * as express from 'express'
import * as config from 'config'
import { Paths as ClaimPaths } from 'claim/paths'
import { buildURL } from 'utils/callbackBuilder'
import { Paths as AppPaths } from 'app/paths'
import * as Cookies from 'cookies'
import IdamClient from 'idam/idamClient'
import { AuthToken } from 'idam/authToken'
import * as toBoolean from 'to-boolean'

async function getAuthToken (req: express.Request) {
  const code = req.query.code
  const clientId = config.get<string>('oauth.clientId')
  const clientSecret = config.get<string>('oauth.clientSecret')
  const continueUrl = `${buildURL(req, AppPaths.receiver.uri.substring(1))}`
  const url = `${config.get('idam.api.url')}/oauth2/token?grant_type=authorization_code&code=${code}&client_secret=${clientSecret}&client_id=${clientId}&redirect_uri=${continueUrl}`
  return await IdamClient.retrieveAuthToken(url)
}

export default express.Router()
  .get('/receiver', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

    const sessionCookie = config.get<string>('session.cookieName')
    const cookies = new Cookies(req, res)
    const useOauth = toBoolean(config.get<boolean>('featureToggles.idamOauth'))

    if (!useOauth && req.query.jwt) {
      cookies.set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
    } else if (useOauth) {
      const authToken: AuthToken = await getAuthToken(req)
      cookies.set(sessionCookie, authToken.accessToken, { sameSite: 'lax' })
    }

    res.redirect(ClaimPaths.startPage.uri)
  })
