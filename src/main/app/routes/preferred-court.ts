import * as express from 'express'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ClaimDraftMiddleware } from 'drafts/claimDraftMiddleware'
import { RoutablePath } from 'app/common/router/routablePath'
import PreferredCourt from 'app/forms/models/preferredCourt'

class Paths {
  static readonly preferredCourtPage = new RoutablePath( '/claim/preferred-court' )
  static readonly typeOfClaimantPage = new RoutablePath( '/claim/what-type-of-claimant' )
}

function renderView (form: Form<PreferredCourt>, res: express.Response): void {
  res.render( Paths.preferredCourtPage.associatedView, { form: form } )
}

export default express.Router()
  .get( Paths.preferredCourtPage.uri, (req: express.Request, res: express.Response) => {
    renderView( new Form( res.locals.user.claimDraft.preferredCourt ), res )
  } )
  .post( Paths.preferredCourtPage.uri, FormValidator.requestHandler( PreferredCourt, PreferredCourt.fromObject ), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<PreferredCourt> = req.body

    if (form.hasErrors()) {
      renderView( form, res )
    } else {
      res.locals.user.claimDraft.preferredCourt = form.model
      ClaimDraftMiddleware.save( res, next )
        .then( () => res.redirect( Paths.typeOfClaimantPage.uri ) )
    }

  } )
