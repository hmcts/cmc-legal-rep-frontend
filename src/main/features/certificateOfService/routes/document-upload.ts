import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import * as formidable from 'formidable'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { DraftService } from 'services/draftService'
import DocumentsClient from 'app/documents/documentsClient'

function renderView (res: express.Response): void {
  const files: UploadedDocument = res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments
  res.render(Paths.documentUploadPage.associatedView,
    { files: files }
  )
}

export default express.Router()
  .get(Paths.documentUploadPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(Paths.documentUploadPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const form = new formidable.IncomingForm()
    form.uploadDir = 'src/main/public/uploadedFiles/'
    form.keepExtensions = true
    form.multiples = true
    form.parse(req)
      .on('file', function (name, file) {
        DocumentsClient.save(res.locals.user.bearerToken, file).then((filePath) => {

          res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments = new UploadedDocument(file.name, filePath)
          new DraftService().save(res.locals.user.legalCertificateOfServiceDraft, res.locals.user.bearerToken)
        })

      })

    res.redirect(Paths.documentUploadPage.uri)
  })
