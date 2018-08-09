import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import { Paths as ClaimPaths } from 'claim/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import * as DraftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']

describe('Claim issue: start page', () => {
  beforeEach(() => {
    mock.cleanAll()
    DraftStoreServiceMock.resolveFind('legalClaim')
    DraftStoreServiceMock.resolveFind('legalCertificateOfService')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.startPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      await request(app)
        .get(ClaimPaths.startPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Issue civil court proceedings'))
    })

    context('with old legal prefix', () => {
      it('should redirect without legal prefix', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        idamServiceMock.resolveRetrieveServiceToken()
        await request(app)
          .get('/legal/claim/start')
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
      })
    })

  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.startPage.uri)

    it('should return 500 and render error page when can not delete draft claim', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      DraftStoreServiceMock.rejectDelete(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.startPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to representative-name page when delete previous draft is successful', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      DraftStoreServiceMock.resolveDelete()
      DraftStoreServiceMock.resolveDelete()
      DraftStoreServiceMock.resolveDelete()
      DraftStoreServiceMock.resolveDelete()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.startPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.representativeNamePage.uri))
    })
  })
})
