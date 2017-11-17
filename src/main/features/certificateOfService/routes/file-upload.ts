///<reference path="../../../app/claims/models/uploadedDocument.ts"/>
import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import * as formidable from 'formidable'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { DraftService } from 'services/draftService'
import DocumentsClient from 'app/documents/documentsClient'

function renderView (res: express.Response): void {
  const files: UploadedDocument = res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments
  res.render(Paths.fileUploadPage.associatedView,
    { files: files }
  )
}

export default express.Router()
  .get(Paths.fileUploadPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(Paths.fileUploadPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    // console.log('fileUpload')
    const form = new formidable.IncomingForm()
    form.uploadDir = 'src/main/public/uploadedFiles/'
    form.keepExtensions = true
    form.multiples = true
    form.parse(req)
      .on('file', function (name, file) {
        DocumentsClient.save(res.locals.user.bearerToken, file).then((documentManagementURI) => {
          let files: UploadedDocument[] = []
          const documentType = res.locals.user.legalUploadDocumentDraft.document.fileToUpload
          res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments.map((file) => files.push(new UploadedDocument().deserialize(file)))
          // console.log(documentType)
          files.push(new UploadedDocument(file.name, file.type, documentType, documentManagementURI))

          res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments = files
          new DraftService().save(res.locals.user.legalCertificateOfServiceDraft, res.locals.user.bearerToken)
        })
      })

    res.redirect(Paths.documentUploadPage.uri)
  })
