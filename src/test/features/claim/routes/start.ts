import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import { Paths as ClaimPaths } from 'claim/paths'
import { app } from '../../../../main/app'
import * as idamServiceMock from '../../../http-mocks/idam'
import { checkAuthorizationGuards } from './checks/authorization-check'
import * as DraftStoreServiceMock from '../../../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const draftType = 'legalClaim'
const roles: string[] = ['solicitor']

describe('Claim issue: start page', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.startPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      await request(app)
        .get(ClaimPaths.startPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Issue civil court proceedings'))
    })

  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.startPage.uri)

    it('should return 500 and render error page when can not delete draft claim', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      DraftStoreServiceMock.rejectDelete(draftType, 'HTTP error')

      await request(app)
        .post(ClaimPaths.startPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to representative-name page when delete previous draft is successful', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      DraftStoreServiceMock.resolveDelete('legalClaim')
      DraftStoreServiceMock.resolveDelete('view')

      await request(app)
        .post(ClaimPaths.startPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.representativeNamePage.uri))
    })
  })
})
