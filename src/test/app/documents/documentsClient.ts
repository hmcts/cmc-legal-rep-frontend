import { expect } from 'chai'

import DocumentsClient from 'app/documents/documentsClient'

describe('DocumentsClient', () => {
  const userAuthToken = 'bearerToken'

  describe('getSealedClaim', () => {
    it('shouldThrowErrorWhenGivenUndefinedExternalId', () => {
      expect(() => DocumentsClient.getSealedClaim(undefined, userAuthToken)).to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('shouldThrowErrorWhenGivenEmptyExternalId', () => {
      expect(() => DocumentsClient.getSealedClaim('', userAuthToken)).to.throw(Error, 'Claim external ID cannot be blank')
    })
  })
})
