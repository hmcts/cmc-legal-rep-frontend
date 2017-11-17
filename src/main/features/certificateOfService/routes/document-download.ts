import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import DocumentsClient from 'app/documents/documentsClient'
import * as http from 'http'
import * as HttpStatus from 'http-status-codes'

export default express.Router()
  .get(Paths.documentDownloadPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    DocumentsClient.getBinaryUrl(res.locals.user.bearerToken, req.query.selfPath)
      .then(binaryPath => {

        DocumentsClient.getPdfFile(res.locals.user.bearerToken, binaryPath)
          .on('response', (response: http.IncomingMessage) => {
            if (response.statusCode !== 200) {
              return next(new Error('Unexpected error during document retrieval'))
            }
            const buffers: Buffer[] = []
            response.on('data', (chunk: Buffer) => {
              buffers.push(chunk)
            })
            response.on('end', () => {
              const pdf = Buffer.concat(buffers)
              res.writeHead(HttpStatus.OK, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${req.query.fileName}`,
                'Content-Length': pdf.length
              })

              res.end(pdf)
            })
          })
          .on('error', (err: Error) => {
            next(err)
          })
      })
  })
