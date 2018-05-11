import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']

describe('Claim : Your organisation contact details page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.representativeContactsPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.representativeContactsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Your organisation contact details'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.representativeContactsPage.uri)

    it('should render page when form is invalid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.representativeContactsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ phoneNumber: '09', email: 'hg', dxAddress: '' })
        .expect(res => expect(res).to.be.successful.withText('Your organisation contact details', 'div class="error-summary"'))
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.representativeContactsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ phoneNumber: '0982345523', email: 'email@example.com', dxAddress: 'given address' })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to your reference page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.representativeContactsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ phoneNumber: '0982345523', email: 'email@example.com', dxAddress: 'given address' })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.yourReferencePage.uri))
    })
  })
})
