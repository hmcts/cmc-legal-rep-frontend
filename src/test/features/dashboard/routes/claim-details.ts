import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import { Paths as DashboardPaths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']

describe('Dashboard: claim details page', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', DashboardPaths.claimDetailsPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('dashboard')
      claimStoreServiceMock.resolveRetrieveClaimByClaimNumber()
      await request(app)
        .get(DashboardPaths.claimDetailsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Date issued'))
    })
  })
})
