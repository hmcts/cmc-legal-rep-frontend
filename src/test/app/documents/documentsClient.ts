import { expect } from 'chai'

import DocumentsClient from 'app/documents/documentsClient'

describe('DocumentsClient', () => {
  const client: DocumentsClient = new DocumentsClient()
  const userAuthToken = 'bearerToken'

  describe('getSealedClaim', () => {
    it('shouldThrowErrorWhenGivenUndefinedExternalId', () => {
      expect(() => client.getSealedClaim(undefined, userAuthToken)).to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('shouldThrowErrorWhenGivenEmptyExternalId', () => {
      expect(() => client.getSealedClaim('', userAuthToken)).to.throw(Error, 'Claim external ID cannot be blank')
    })
  })
})
