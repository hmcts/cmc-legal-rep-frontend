import * as mock from 'nock'

import * as DraftStoreServiceMock from 'test/http-mocks/draft-store'

describe('Claim issue: start page', () => {
  beforeEach(() => {
    mock.cleanAll()
    DraftStoreServiceMock.resolveFind('legalClaim')
    DraftStoreServiceMock.resolveFind('legalCertificateOfService')
  })
})
