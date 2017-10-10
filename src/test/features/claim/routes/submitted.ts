import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import { Paths as ClaimPaths } from 'claim/paths'
import { app } from '../../../../main/app'
import * as idamServiceMock from '../../../http-mocks/idam'
import { checkAuthorizationGuards } from './checks/authorization-check'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { sampleClaimObj } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']
const pageHeading = 'Your claim has been issued'
const draftType: string = 'legalClaim'

describe('Claim issue: Submitted page', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimSubmittedPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, ...roles)
      claimStoreServiceMock.resolveRetrieveClaimByExternalId()

      await request(app)
        .get(ClaimPaths.claimSubmittedPage.uri.replace(':externalId', sampleClaimObj.externalId))
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageHeading))
    })

    it('should fail page when user is not owner of claim with given external reference', async () => {
      idamServiceMock.resolveRetrieveUserFor(2, ...roles)
      claimStoreServiceMock.resolveRetrieveClaimByExternalId()

      await request(app)
        .get(ClaimPaths.claimSubmittedPage.uri.replace(':externalId', sampleClaimObj.externalId))
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.forbidden)
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.claimSubmittedPage.uri)

    it('should redirect to start page when is successful', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, ...roles)
      draftStoreServiceMock.resolveRetrieve(draftType)

      await request(app)
        .post(ClaimPaths.claimSubmittedPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
    })
  })
})
