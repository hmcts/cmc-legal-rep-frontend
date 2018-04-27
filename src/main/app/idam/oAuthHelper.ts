import * as express from 'express'
import * as config from 'config'
import * as uuid from 'uuid'
import * as Cookies from 'cookies'
import { buildURL } from 'utils/callbackBuilder'
import { Paths as AppPaths } from 'paths'

export class OAuthHelper {
  static getRedirectUri (req: express.Request, res: express.Response): string {
    const clientId = config.get<string>('oauth.clientId')
    const redirectUri = buildURL(req, AppPaths.receiver.uri.substring(1))
    const state = uuid()
    this.storeStateCookie(req, res, state)

    return `${config.get('idam.authentication-web.url')}/login?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  static getStateCookie (req: express.Request): string {
    return req.cookies['state']
  }

  private static storeStateCookie (req: express.Request, res: express.Response, state: string): void {
    const cookies = new Cookies(req, res)
    cookies.set('state', state, { sameSite: 'lax' })
  }
}
