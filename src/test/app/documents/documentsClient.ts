import { expect } from 'chai'

import DocumentsClient from 'app/documents/documentsClient'

describe('DocumentsClient', () => {
  const client: DocumentsClient = new DocumentsClient()
  const bearerToken: string = 'bearer token'

  describe('getSealedClaim', () => {
    it('shouldThrowErrorWhenGivenUndefinedExternalId', () => {
      expect(() => client.getSealedClaim(undefined, bearerToken)).to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('shouldThrowErrorWhenGivenEmptyExternalId', () => {
      expect(() => client.getSealedClaim('', bearerToken)).to.throw(Error, 'Claim external ID cannot be blank')
    })
  })
})
