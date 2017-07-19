import * as express from 'express'

class Paths {
  static main: string = '/claim/start'
}

export default express.Router()
  .get(Paths.main, (req: express.Request, res: express.Response) => {
    res.render('claim/start')
  })
  .post(Paths.main, (req: express.Request, res: express.Response) => {
    res.redirect('claim/your-reference')
  })
