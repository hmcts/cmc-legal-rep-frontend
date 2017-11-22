import * as express from 'express'
import { Paths } from 'certificateOfService/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { WhatDocuments } from 'app/forms/models/whatDocuments'
import ErrorHandling from 'common/errorHandling'
import { DraftService } from '../../../services/draftService'

function renderView (form: Form<WhatDocuments>, res: express.Response): void {
  res.render(Paths.whatDocumentsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.whatDocumentsPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalCertificateOfServiceDraft.document.whatDocuments), res)
  })
  .post(Paths.whatDocumentsPage.uri, FormValidator.requestHandler(WhatDocuments, WhatDocuments.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<WhatDocuments> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        res.locals.user.legalCertificateOfServiceDraft.document.whatDocuments = form.model
        res.locals.user.legalUploadDocumentDraft.document.fileToUpload = undefined
        await new DraftService().save(res.locals.user.legalCertificateOfServiceDraft, res.locals.user.bearerToken)
        await new DraftService().save(res.locals.user.legalUploadDocumentDraft, res.locals.user.bearerToken)

        if (res.locals.user.legalCertificateOfServiceDraft && res.locals.user.legalCertificateOfServiceDraft['id']) {
          try {
            await new DraftService().delete(res.locals.user.legalCertificateOfServiceDraft['id'], res.locals.user.bearerToken)
            await new DraftService().delete(res.locals.user.legalUploadDocumentDraft['id'], res.locals.user.bearerToken)
          } catch (err) {
            next(err)
          }
        }
        res.redirect(Paths.documentUploadPage.uri)
      }

    })
  )
