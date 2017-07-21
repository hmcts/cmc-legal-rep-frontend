import * as express from 'express'
import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import PreferredCourt from 'app/forms/models/preferredCourt'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'

class Paths {
  static readonly preferredCourtRoute: string = '/claim/preferred-court'
  static readonly preferredCourtView: string = 'claim/preferred-court'
}

function renderView (form: Form<PreferredCourt>, res: express.Response): void {
  res.render( Paths.preferredCourtView, { form: form } )
}

export default express.Router()
  .get( Paths.preferredCourtRoute, (req: express.Request, res: express.Response) => {
    renderView( new Form( res.locals.user.claimDraft.preferredCourt ), res )
  } )
  .post( Paths.preferredCourtRoute, FormValidator.requestHandler( PreferredCourt, PreferredCourt.fromObject ), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<PreferredCourt> = req.body
    if (form.hasErrors()) {
      renderView( form, res )
    } else {
      res.locals.user.claimDraft.preferredCourt = form.model
      ClaimDraftMiddleware.save( res, next )
        .then( () => res.redirect( Paths.preferredCourtRoute ) )
    }

  } )
