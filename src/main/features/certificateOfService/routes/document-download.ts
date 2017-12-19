import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import DocumentsClient from 'app/documents/documentsClient'
import * as http from 'http'
import * as HttpStatus from 'http-status-codes'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { ForbiddenError } from '../../../errors'
import { Draft } from '@hmcts/draft-store-client'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'

export default express.Router()
  .get(Paths.documentDownloadPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
    const documents: UploadedDocument[] = draft.document.uploadedDocuments
    const document: UploadedDocument = documents.find(document => document.documentManagementURI === req.query.id)
    if (document === undefined) {
      throw new ForbiddenError()
    }
    DocumentsClient.getBinaryUrl(res.locals.user.bearerToken, req.query.id)
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
              const type = document.fileType

              res.writeHead(HttpStatus.OK, {
                'Content-Type': `${type}`,
                'Content-Disposition': `attachment; filename=${document.fileName}`,
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
