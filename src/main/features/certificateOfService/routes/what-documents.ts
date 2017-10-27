import * as express from 'express'
import { Paths } from 'certificateOfService/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { DocumentType } from 'app/forms/models/documentType'
import { CertificateOfServiceDraftMiddleware } from 'certificateOfService/draft/middleware'
import ErrorHandling from 'common/errorHandling'

function renderView (form: Form<DocumentType>, res: express.Response): void {
  res.render(Paths.whatDocumentsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.whatDocumentsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalCertificateOfServiceDraft.whatDocuments), res)
  })
  .post(Paths.whatDocumentsPage.uri, FormValidator.requestHandler(DocumentType, DocumentType.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DocumentType> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalCertificateOfServiceDraft.whatDocuments = form.model
        await CertificateOfServiceDraftMiddleware.save(res, next)
        res.redirect(Paths.whatDocumentsPage.uri)
      }

    })
  )
