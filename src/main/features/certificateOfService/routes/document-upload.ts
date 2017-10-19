import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import { Form } from 'app/forms/form'
// import { FormValidator } from 'app/forms/validation/formValidator'
// import { CertificateOfServiceDraftMiddleware } from 'certificateOfService/draft/middleware'
// import ErrorHandling from 'common/errorHandling'
import { DocumentUpload } from 'forms/models/documentUpload'
import * as formidable from 'formidable'
// import * as fs from 'fs'
import * as clam from 'clam-engine'

function renderView (form: Form<DocumentUpload>, res: express.Response): void {
  res.render(Paths.documentUploadPage.associatedView, { form: form, filePath: 'HO00004283.jpg' })
}

export default express.Router()
  .get(Paths.documentUploadPage.uri, (req: express.Request, res: express.Response) => {
    renderView(new Form(res.locals.user.legalCertificateOfServiceDraft.uploadedDocuments), res)
  })
  .post(Paths.documentUploadPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const form = new formidable.IncomingForm()
    form.parse(req)

    form.on('file', function (name, file) {
      clam.createEngine(function (err, engine) {
        if (err) {
          return console.log('Error', err)
        }
        engine.scanFile(file.path, function (err, virus) {
          if (err) {
            return console.log('Error', err)
          }
          if (virus) {
            return console.log('Virus', virus)
          }
          console.log('Clean')
        })
      })
      // fs.rename(file.path, 'src/main/public/' + file.name, function (err) {
      //   if ( err ) console.log('ERROR: ' + err)
      // })
      console.log('Uploaded ' + file.name)
    })
    res.redirect(Paths.documentUploadPage.uri)
  })
