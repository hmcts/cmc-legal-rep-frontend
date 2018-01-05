import * as express from 'express'
import * as fileType from 'file-type'
import * as readChunk from 'read-chunk'
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
import { FileUploadErrors } from 'forms/models/fileTypeErrors'
import { Draft } from '@hmcts/draft-store-client'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'
import { DraftUploadDocument } from 'drafts/models/draftUploadDocument'

export default express.Router()
  .post(Paths.fileUploadPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const viewDraft: Draft<DraftUploadDocument> = res.locals.legalUploadDocumentDraft
      const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
      const form = new formidable.IncomingForm()
      const user: User = res.locals.user
      const FILE_SIZE_LIMIT: number = 10485760
      const TIME_OUT: number = 7200000
      form.keepExtensions = true
      req.setTimeout(TIME_OUT,function () {
        viewDraft.document.fileToUploadError = FileUploadErrors.FILE_UPLOAD_TIMEOUT
        new DraftService().save(viewDraft, user.bearerToken).then(() => {
          res.redirect(Paths.documentUploadPage.uri)
        })
      })

      form.parse(req)
      .on('file', function (name, file) {
        const buffer = readChunk.sync(file.path, 0, 4100)
        console.log(fileType(buffer))
        if (file.size === 0) {
          viewDraft.document.fileToUploadError = FileUploadErrors.FILE_REQUIRED
          new DraftService().save(viewDraft, user.bearerToken).then(() => {
            res.redirect(Paths.documentUploadPage.uri)
          })
        } else if (file.size > FILE_SIZE_LIMIT) {
          viewDraft.document.fileToUploadError = FileUploadErrors.FILE_TOO_LARGE
          new DraftService().save(viewDraft, user.bearerToken).then(() => {
            res.redirect(Paths.documentUploadPage.uri)
          })
        } else if (FileTypes.acceptedMimeTypes().indexOf(file.type) === -1) {
          viewDraft.document.fileToUploadError = FileUploadErrors.WRONG_FILE_TYPE
          new DraftService().save(viewDraft, user.bearerToken).then(() => {
            res.redirect(Paths.documentUploadPage.uri)
          })
        } else {
          DocumentsClient.save(user.bearerToken, file).then((documentManagementURI) => {
            const documentType: DocumentType = viewDraft.document.fileToUpload
            let files: UploadedDocument[] = []
            draft.document.uploadedDocuments.map((file) => files.push(new UploadedDocument().deserialize(file)))

            const fileType = FileTypes.all().find(fileType => fileType.mimeType === file.type)

            files.push(new UploadedDocument(file.name, fileType, documentType, documentManagementURI))

            fs.unlink(file.path, function (err) {
              if (err) {
                next(err)
              }
            })
            draft.document.uploadedDocuments = files
            new DraftService().save(draft, user.bearerToken)

            viewDraft.document.fileToUploadError = undefined
            viewDraft.document.fileToUpload = undefined
            new DraftService().save(viewDraft, user.bearerToken).then(() => {
              res.redirect(Paths.documentUploadPage.uri)
            })
          }).catch(next)
        }
      })
    })
  )
