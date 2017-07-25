import * as express from 'express'
import { Form } from 'app/forms/form'
import { Paths } from 'claim/paths'

import { FormValidator } from 'app/forms/validation/formValidator'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import CompanyName from 'forms/models/companyName'

function renderView (form: Form<CompanyName>, res: express.Response): void {
  res.render( Paths.representativeNamePage.associatedView, { form: form } )
}

export default express.Router()
  .get( Paths.representativeNamePage.uri, (req: express.Request, res: express.Response) => {
    renderView( new Form( res.locals.user.claimDraft.representative.companyName ), res )
  } )
  .post( Paths.representativeNamePage.uri, FormValidator.requestHandler( CompanyName, CompanyName.fromObject ), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const form: Form<CompanyName> = req.body
    if (form.hasErrors()) {
      renderView( form, res )
    } else {
      res.locals.user.claimDraft.representative.companyName = form.model
      ClaimDraftMiddleware.save( res, next )
        .then( () => res.redirect( Paths.representativeAddressPage.uri ) )
    }

  } )
