import * as express from 'express'
import { Paths } from 'certificateOfService/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { WhatDocuments } from 'app/forms/models/whatDocuments'
import ErrorHandling from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'
import { DraftUploadDocument } from 'drafts/models/draftUploadDocument'

function renderView (form: Form<WhatDocuments>, res: express.Response): void {
  res.render(Paths.whatDocumentsPage.associatedView, { form: form })
}

export default express.Router()
  .get(Paths.whatDocumentsPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
    renderView(new Form(draft.document.whatDocuments), res)
  })
  .post(Paths.whatDocumentsPage.uri, FormValidator.requestHandler(WhatDocuments, WhatDocuments.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
      const viewDraft: Draft<DraftUploadDocument> = res.locals.legalUploadDocumentDraft
      const form: Form<WhatDocuments> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        draft.document.whatDocuments = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)

        viewDraft.document.fileToUpload = undefined
        await new DraftService().save(viewDraft, res.locals.user.bearerToken)

        res.redirect(Paths.documentUploadPage.uri)
      }

    })
  )
