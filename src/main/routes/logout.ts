import * as express from 'express'
import * as config from 'config'

import { Paths } from 'app/paths'
import * as Cookies from 'cookies'

const sessionCookie = config.get<string>('session.cookieName')

export default express.Router()
  .get(Paths.logoutReceiver.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    new Cookies(req, res).set(sessionCookie, '', { sameSite: 'lax' })
    res.redirect(Paths.homePage.uri)
  })
