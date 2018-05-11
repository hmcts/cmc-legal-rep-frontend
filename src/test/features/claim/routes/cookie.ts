import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import { Paths as ClaimPaths } from 'claim/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import { checkAuthorizationGuards } from './checks/authorization-check'
import * as DraftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']

describe('Claim issue: cookie page', () => {
  beforeEach(() => {
    mock.cleanAll()
    DraftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.cookiePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      await request(app)
        .get(ClaimPaths.cookiePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Cookies'))
    })

  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.cookiePage.uri)

    it('should redirect to start page when', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.cookiePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
    })
  })
})
