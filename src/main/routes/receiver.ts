import * as express from 'express'
import * as config from 'config'
import { Paths as ClaimPaths } from 'claim/paths'

import * as Cookies from 'cookies'

export default express.Router()
  .get('/receiver', async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.query.jwt) {
      const sessionCookie = config.get<string>('session.cookieName')
      new Cookies(req, res).set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
    }

    res.redirect(ClaimPaths.startPage.uri)
  })
