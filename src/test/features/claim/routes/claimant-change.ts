import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']

const claimants = {
  claimants: [{
    claimantDetails: {
      type: 'INDIVIDUAL',
      fullName: 'fullName'
    },
    address: {
      line1: 'Apt 99',
      city: 'London',
      postcode: 'SW1A 1AA'
    }
  },
    {
      claimantDetails: {
        type: 'INDIVIDUAL',
        fullName: 'fullName'
      },
      address: {
        line1: 'Apt 99',
        city: 'London',
        postcode: 'SW1A 1AA'
      }
    }]
}

describe('Claim issue: Claimant change page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveSave()
    idamServiceMock.resolveRetrieveUserFor('1', ...roles)
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimantChangePage.uri)

    it('should redirect to claimant type page for one existing claimant when everything is fine', async () => {
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalClaim')
      draftStoreServiceMock.resolveUpdate()

      await request(app)
        .get(ClaimPaths.claimantChangePage.uri + '?index=1')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantTypePage.uri))
    })

    it('should redirect to claimant address page for one existing claimant when everything is fine', async () => {
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalClaim', claimants)
      draftStoreServiceMock.resolveUpdate()

      await request(app)
        .get(ClaimPaths.claimantChangePage.uri + '?index=1&page=address')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantAddressPage.uri))
    })

    it('should return 500 and render error page when cannot save draft', async () => {
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalClaim', claimants)
      draftStoreServiceMock.rejectSave()

      await request(app)
        .get(ClaimPaths.claimantChangePage.uri + '?index=1')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })
  })
})
