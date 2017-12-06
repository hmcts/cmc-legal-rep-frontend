import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import User from 'idam/user'
import { ForbiddenError } from '../../../errors'
import { DraftService } from 'services/draftService'

export default express.Router()
  .get(Paths.documentRemovePage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user: User = res.locals.user
    const documentToDelete: UploadedDocument = user.legalCertificateOfServiceDraft.document.uploadedDocuments.find(document => document.documentManagementURI === req.query.id)
    if (documentToDelete === undefined) {
      throw new ForbiddenError()
    } else {
      const updatedDocumentsList: UploadedDocument[] = user.legalCertificateOfServiceDraft.document.uploadedDocuments.filter(function (document) {
        return document.documentManagementURI !== documentToDelete.documentManagementURI
      })
      user.legalCertificateOfServiceDraft.document.uploadedDocuments = updatedDocumentsList
      new DraftService().save(user.legalCertificateOfServiceDraft, user.bearerToken).then(() => {
        res.redirect(Paths.documentUploadPage.uri)
      })
    }
  })
