import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']

describe('Claim : Your organisation name page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.representativeNamePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.representativeNamePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Your organisation name'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.representativeNamePage.uri)

    it('should render page when form is invalid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.representativeNamePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Your organisation name', 'div class="error-summary"'))
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.representativeNamePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ name: 'My Company Name' })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to representative-address page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.representativeNamePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ name: 'My Company Name' })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.representativeAddressPage.uri))
    })
  })
})
