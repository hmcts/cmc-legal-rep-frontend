import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import * as formidable from 'formidable'
import * as fs from 'fs'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import * as path from 'path'
import { DraftService } from '../../../services/draftService'

function renderView (res: express.Response): void {
  res.render(Paths.documentUploadPage.associatedView, { files: res.locals.user.legalCertificateOfServiceDraft.uploadedDocuments })
}

export default express.Router()
  .get(Paths.documentUploadPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(Paths.documentUploadPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const documents: Array<Promise<UploadedDocument>> = []
    const form = new formidable.IncomingForm()
    form.uploadDir = 'src/main/public/uploadedFiles/'
    form.keepExtensions = true
    form.multiples = true
    form.parse(req)
      .on('file', function (name, file) {
        documents.push(
          moveFile(file.path, form.uploadDir + file.name)
            .then(file => new UploadedDocument(file.fileName, file.documentManagementURI))
        )

      })
      .on('end', function () {
        Promise.all(documents)
          .then(documents => res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments = documents)
      })

    await new DraftService().save(res.locals.user.legalCertificateOfServiceDraft, res.locals.user.bearerToken)
    res.redirect(Paths.documentUploadPage.uri)
  })

function moveFile (from, to) {
  return new Promise<UploadedDocument>(function (done, reject) {
    fs.rename(from, to, function (err) {
      if (err) {
        return reject(new Error(err.message))
      }

      done(new UploadedDocument(path.basename(to), to))
    })
  })
}
