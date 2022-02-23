import * as mock from 'nock'

import { Paths as ClaimPaths } from 'claim/paths'
import { app } from 'main/app'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import * as DraftStoreServiceMock from 'test/http-mocks/draft-store'

describe('Claim issue: start page', () => {
  beforeEach(() => {
    mock.cleanAll()
    DraftStoreServiceMock.resolveFind('legalClaim')
    DraftStoreServiceMock.resolveFind('legalCertificateOfService')
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.startPage.uri)
  })
})
