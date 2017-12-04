import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import DocumentsClient from 'app/documents/documentsClient'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import User from 'idam/user'
import { ForbiddenError } from '../../../errors'

export default express.Router()
  .post(Paths.documentRemovePage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user: User = res.locals.user
    const documents: UploadedDocument[] = user.legalCertificateOfServiceDraft.document.uploadedDocuments
    const document: UploadedDocument = documents.find(document => document.documentManagementURI === req.query.id)
    if (document === undefined) {
      throw new ForbiddenError()
    } else {
      DocumentsClient.delete(res.locals.user.bearerToken, document.getId())
        .then(status => {
          if (status === 403) {
            throw new ForbiddenError()
          } else {
            res.redirect(Paths.documentUploadPage.uri)
          }
        })
    }
  })
