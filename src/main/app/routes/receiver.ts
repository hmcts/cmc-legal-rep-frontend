import * as express from 'express'
import * as config from 'config'

import * as Cookies from 'cookies'

export default express.Router()
  .get('/receiver', (req, res) => {
    const sessionCookie = config.get<string>('session.cookieName')
    const cookies = new Cookies(req, res)

    cookies.set(sessionCookie, req.query.jwt)
    res.redirect('/')
  })
