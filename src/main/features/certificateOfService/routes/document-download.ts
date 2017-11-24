import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import DocumentsClient from 'app/documents/documentsClient'
import * as http from 'http'
import * as HttpStatus from 'http-status-codes'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import User from 'idam/user'

function getType (documents: UploadedDocument[], fileName: string): string {
  return documents.find((document) => document.fileName === fileName).fileType
}

export default express.Router()
  .get(Paths.documentDownloadPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    DocumentsClient.getBinaryUrl(res.locals.user.bearerToken, req.query.selfPath)
      .then(binaryPath => {

        DocumentsClient.getDocument(res.locals.user.bearerToken, binaryPath)
          .on('response', (response: http.IncomingMessage) => {
            if (response.statusCode !== 200) {
              return next(new Error('Unexpected error during document retrieval'))
            }
            const buffers: Buffer[] = []
            response.on('data', (chunk: Buffer) => {
              buffers.push(chunk)
            })
            response.on('end', () => {
              const fileBuffer = Buffer.concat(buffers)
              const user: User = res.locals.user
              const documents: UploadedDocument[] = user.legalCertificateOfServiceDraft.document.uploadedDocuments
              const type = getType(documents, req.query.fileName)

              res.writeHead(HttpStatus.OK, {
                'Content-Type': `${type}`,
                'Content-Disposition': `attachment; filename=${req.query.fileName}`,
                'Content-Length': fileBuffer.length
              })

              res.end(fileBuffer)
            })
          })
          .on('error', (err: Error) => {
            next(err)
          })
      })
  })
