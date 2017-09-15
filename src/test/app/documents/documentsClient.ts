import { expect } from 'chai'

import DocumentsClient from 'app/documents/documentsClient'

describe('DocumentsClient', () => {
  const client: DocumentsClient = new DocumentsClient()

  describe('getSealedClaim', () => {
    it('shouldThrowErrorWhenGivenUndefinedExternalId', () => {
      expect(() => client.getSealedClaim(undefined)).to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('shouldThrowErrorWhenGivenEmptyExternalId', () => {
      expect(() => client.getSealedClaim('')).to.throw(Error, 'Claim external ID cannot be blank')
    })
  })
})
