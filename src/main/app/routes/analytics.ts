import * as express from 'express'
import * as config from 'config'

class Paths {
  static main: string = '/analytics'
}

export default express.Router()
  .get(Paths.main, (req, res) => {
    const site = config.get('citizen-frontend')

    res.json(site)
  })
