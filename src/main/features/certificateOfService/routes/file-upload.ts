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
import { FileTypes } from 'forms/models/fileTypes'
import { FileTypeErrors } from 'forms/models/fileTypeErrors'

export default express.Router()
  .post(Paths.fileUploadPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form = new formidable.IncomingForm()
      const FILE_SIZE_LIMIT: number = 10485760
      form.keepExtensions = true

      form.parse(req)
      .on('file', function (name, file) {
        const user: User = res.locals.user
        if (file.size === 0) {
          user.legalUploadDocumentDraft.document.fileToUploadError = FileTypeErrors.FILE_REQUIRED
          new DraftService().save(user.legalUploadDocumentDraft, user.bearerToken).then(() => {
            res.redirect(Paths.documentUploadPage.uri)
          })
        } else if (file.size > FILE_SIZE_LIMIT) {
          user.legalUploadDocumentDraft.document.fileToUploadError = FileTypeErrors.FILE_TOO_LARGE
          new DraftService().save(user.legalUploadDocumentDraft, user.bearerToken).then(() => {
            res.redirect(Paths.documentUploadPage.uri)
          })
        } else if (FileTypes.acceptedMimeTypes().indexOf(file.type) === -1) {
          user.legalUploadDocumentDraft.document.fileToUploadError = FileTypeErrors.WRONG_FILE_TYPE
          new DraftService().save(user.legalUploadDocumentDraft, user.bearerToken).then(() => {
            res.redirect(Paths.documentUploadPage.uri)
          })
        } else {
          DocumentsClient.save(user.bearerToken, file).then((documentManagementURI) => {
            const documentType: DocumentType = user.legalUploadDocumentDraft.document.fileToUpload
            let files: UploadedDocument[] = []
            user.legalCertificateOfServiceDraft.document.uploadedDocuments.map((file) => files.push(new UploadedDocument().deserialize(file)))

            const fileType = FileTypes.all().find(fileType => fileType.mimeType === file.type)

            files.push(new UploadedDocument(file.name, fileType, documentType, documentManagementURI))

            fs.unlink(file.path, function (err) {
              if (err) {
                next(err)
              }
            })
            user.legalCertificateOfServiceDraft.document.uploadedDocuments = files
            new DraftService().save(user.legalCertificateOfServiceDraft, user.bearerToken)

            user.legalUploadDocumentDraft.document.fileToUploadError = undefined
            user.legalUploadDocumentDraft.document.fileToUpload = undefined
            new DraftService().save(user.legalUploadDocumentDraft, user.bearerToken).then(() => {
              res.redirect(Paths.documentUploadPage.uri)
            })
          })
        }
      })
    })
  )
