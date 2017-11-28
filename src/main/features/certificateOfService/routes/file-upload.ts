import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import * as formidable from 'formidable'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { DraftService } from 'services/draftService'
import DocumentsClient from 'app/documents/documentsClient'
import { DocumentType } from 'forms/models/documentType'
import * as fs from 'fs'
import User from 'idam/user'
import ErrorHandling from 'common/errorHandling'

export default express.Router()
  .post(Paths.fileUploadPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form = new formidable.IncomingForm()
      form.keepExtensions = true

      form.parse(req)
      .on('file', function (name, file) {
        if (file.size === 0) {
          res.redirect(Paths.documentUploadPage.uri)
        }
        const user: User = res.locals.user
        DocumentsClient.save(user.bearerToken, file).then((documentManagementURI) => {
          let files: UploadedDocument[] = []
          const documentType: DocumentType = user.legalUploadDocumentDraft.document.fileToUpload
          user.legalCertificateOfServiceDraft.document.uploadedDocuments.map((file) => files.push(new UploadedDocument().deserialize(file)))
          files.push(new UploadedDocument(file.name, file.type, documentType, documentManagementURI))

          fs.unlink(file.path, function (err) {
            if (err) {
              next(err)
            }
          })

          user.legalCertificateOfServiceDraft.document.uploadedDocuments = files
          new DraftService().save(user.legalCertificateOfServiceDraft, user.bearerToken)

          user.legalUploadDocumentDraft.document.fileToUpload = undefined
          new DraftService().save(user.legalUploadDocumentDraft, user.bearerToken)
          res.redirect(Paths.documentUploadPage.uri)
        })
      })
    })
  )
