import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
// import * as formidable from 'formidable'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { DraftService } from 'services/draftService'
import DocumentsClient from 'app/documents/documentsClient'
import { DocumentType } from 'forms/models/documentType'
// import * as fs from 'fs'
import User from 'idam/user'
import * as multiparty from 'multiparty'

export default express.Router()
  .post(Paths.fileUploadPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    // const form = new formidable.IncomingForm()
    const form = new multiparty.Form()
    let fileBuffer = ''
    let contentType = ''
    let fileName = ''
    // form.uploadDir = 'src/main/public/uploadedFiles/'
    // form.keepExtensions = true
    // form.multiples = true

    form.on('part', function (part) {
      if (!part.filename) return
      contentType = part.headers['content-type']
      fileName = part.filename
      part.on('data', function (buffer) {
        fileBuffer += buffer
      })
    })

    form.on('close', function () {
      const user: User = res.locals.user
      DocumentsClient.save(user.bearerToken, fileName, Buffer.from(fileBuffer, 'binary') , contentType).then((documentManagementURI) => {
        let files: UploadedDocument[] = []
        const documentType: DocumentType = user.legalUploadDocumentDraft.document.fileToUpload
        user.legalCertificateOfServiceDraft.document.uploadedDocuments.map((file) => files.push(new UploadedDocument().deserialize(file)))

        files.push(new UploadedDocument(fileName, contentType, documentType, documentManagementURI))
        user.legalCertificateOfServiceDraft.document.uploadedDocuments = files

        new DraftService().save(user.legalCertificateOfServiceDraft, user.bearerToken)
        user.legalUploadDocumentDraft.document.fileToUpload = undefined
        new DraftService().save(user.legalUploadDocumentDraft, user.bearerToken)
        res.redirect(Paths.documentUploadPage.uri)
      })
    })
    form.parse(req)
    // form.parse(req, function(err, fields, files) {
    // })
    // res.redirect(Paths.documentUploadPage.uri)

    // form.parse(req)
    //   .on('file', function (name, file) {
    //     if (file.size === 0) {
    //       res.redirect(Paths.documentUploadPage.uri)
    //     }
    //     const user: User = res.locals.user
    //     DocumentsClient.save(user.bearerToken, file).then((documentManagementURI) => {
    //       let files: UploadedDocument[] = []
    //       const documentType: DocumentType = user.legalUploadDocumentDraft.document.fileToUpload
    //       user.legalCertificateOfServiceDraft.document.uploadedDocuments.map((file) => files.push(new UploadedDocument().deserialize(file)))
    //       files.push(new UploadedDocument(file.name, file.type, documentType, documentManagementURI))
    //
    //       fs.unlink(file.path, function (err) {
    //         if (err) next(err)
    //       })
    //
    //       user.legalCertificateOfServiceDraft.document.uploadedDocuments = files
    //       new DraftService().save(user.legalCertificateOfServiceDraft, user.bearerToken)
    //
    //       user.legalUploadDocumentDraft.document.fileToUpload = undefined
    //       new DraftService().save(user.legalUploadDocumentDraft, user.bearerToken)
    //       res.redirect(Paths.documentUploadPage.uri)
    //     })
    //   })
  })
