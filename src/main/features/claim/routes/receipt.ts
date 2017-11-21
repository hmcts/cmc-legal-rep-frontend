import * as express from 'express'
import * as http from 'http'
import * as HttpStatus from 'http-status-codes'

import { Paths } from 'claim/paths'

import DocumentsClient from 'app/documents/documentsClient'
import ClaimStoreClient from 'app/claims/claimStoreClient'
import Claim from 'app/claims/models/claim'
import User from 'idam/user'

const documentsClient: DocumentsClient = new DocumentsClient()

export default express.Router()
  .get(Paths.receiptReceiver.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { externalId } = req.params
    try {
      const user: User = res.locals.user
      const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId, user.id)
      documentsClient.getSealedClaim(externalId, user.bearerToken)
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
              'Content-Disposition': `attachment; filename=${claim.claimNumber}.pdf`,
              'Content-Length': pdf.length
            })

            res.end(pdf)
          })
        })
        .on('error', (err: Error) => {
          next(err)
        })
    } catch (err) {
      next(err)
    }
  })
