import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { ForbiddenError } from '../../../errors'
import ErrorHandling from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'

export default express.Router()
  .get(Paths.documentRemovePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
      const documentToDelete: UploadedDocument = draft.document.uploadedDocuments.find(document => document.documentManagementURI === req.query.id)
      if (documentToDelete === undefined) {
        throw new ForbiddenError()
      } else {
        const updatedDocumentsList: UploadedDocument[] = draft.document.uploadedDocuments.filter(function (document) {
          return document.documentManagementURI !== documentToDelete.documentManagementURI
        })
        draft.document.uploadedDocuments = updatedDocumentsList
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(Paths.documentUploadPage.uri)
      }
    }))
