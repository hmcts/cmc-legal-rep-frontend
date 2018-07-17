import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths as AppPaths } from 'paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreMock from 'test/http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const token = 'I am dummy access token'

describe.only('Claim issue: post login receiver', () => {

  describe('on GET', () => {
    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-solicitor')
      })

      it('should save JWT token in cookie', async () => {
        idamServiceMock.resolveRetrieveAuthTokenFor(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC`)
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })

      it('should clear state token in cookie', async () => {
        idamServiceMock.resolveRetrieveAuthTokenFor(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=123')
          .expect(res => expect(res).to.have.cookie('state', ''))
      })

      it('should render error page when state doesn’t match', async () => {
        idamServiceMock.resolveRetrieveAuthTokenFor(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC&state=123`)
          .set('Cookie', 'state=1234')
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should not remove bearer token saved in cookie when code does not exist in query string', async () => {

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.not.have.cookie(cookieName, ''))
      })

      it('should redirect to start page for authToken when everything is fine', async () => {
        idamServiceMock.resolveRetrieveAuthTokenFor(token)
        claimStoreMock.resolveRetrieveBySubmitterIdToEmptyList()

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=code`)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
      })

      it('should redirect to dashboard page when claim exists', async () => {
        idamServiceMock.resolveRetrieveAuthTokenFor(token)
        claimStoreMock.resolveRetrieveBySubmitterId()

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=code`)
          .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.searchPage.uri))
      })

    })
  })
})
