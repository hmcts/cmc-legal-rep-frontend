import * as express from 'express'

class Paths {
  static main: string = '/claim/start'
}

export default express.Router()
  .get(Paths.main, (req, res) => {
    res.render('claim/start')
  })
  .post(Paths.main, (req, res) => {
    res.redirect('claim/what-type-of-claimant')
  })
