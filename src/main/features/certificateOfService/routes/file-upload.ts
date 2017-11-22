import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import * as formidable from 'formidable'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { DraftService } from 'services/draftService'
import DocumentsClient from 'app/documents/documentsClient'
import { DocumentType } from 'forms/models/documentType'
import * as fs from 'fs'

export default express.Router()
  .post(Paths.fileUploadPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const form = new formidable.IncomingForm()
    form.uploadDir = 'src/main/public/uploadedFiles/'
    form.keepExtensions = true
    form.multiples = true

    form.parse(req)
      .on('file', function (name, file) {
        DocumentsClient.save(res.locals.user.bearerToken, file).then((documentManagementURI) => {
          let files: UploadedDocument[] = []
          const documentType: DocumentType = res.locals.user.legalUploadDocumentDraft.document.fileToUpload
          res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments.map((file) => files.push(new UploadedDocument().deserialize(file)))
          files.push(new UploadedDocument(file.name, file.type, documentType, documentManagementURI))

          fs.unlink(file.path, function (err) {
            if (err) next(err)
          })

          res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments = files
          new DraftService().save(res.locals.user.legalCertificateOfServiceDraft, res.locals.user.bearerToken)

          res.locals.user.legalUploadDocumentDraft.document.fileToUpload = undefined
          new DraftService().save(res.locals.user.legalUploadDocumentDraft, res.locals.user.bearerToken)
        })
      })
      .on('end', function () {
        res.redirect(Paths.documentUploadPage.uri)
      })
  })
