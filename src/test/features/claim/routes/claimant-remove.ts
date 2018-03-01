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

const twoClaimants = {
  claimants: [{
    address: {
      line1: 'Apt 99',
      city: 'London',
      postcode: 'E1'
    },
    representative: {
      organisationName: 'Defendant Organisation Name',
      address: {
        line1: 'Apt 99',
        line2: 'Building A',
        city: 'London',
        postcode: 'E1'
      }
    },
    claimantDetails: {
      type: 'INDIVIDUAL',
      fullName: 'fullName'
    }
  },
    {
      address: {
        line1: 'Apt 99',
        city: 'London',
        postcode: 'E1'
      },
      representative: {
        organisationName: 'Defendant Organisation Name',
        address: {
          line1: 'Apt 99',
          line2: 'Building A',
          city: 'London',
          postcode: 'E1'
        }
      },
      claimantDetails: {
        type: 'INDIVIDUAL',
        fullName: 'fullName'
      }
    }]
}

describe('Claim issue: is claimant removal page, single claimant', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
    idamServiceMock.resolveRetrieveServiceToken()
    idamServiceMock.resolveRetrieveServiceToken()
    idamServiceMock.resolveRetrieveUserFor('1', ...roles)
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimantRemovePage.uri)

    it('should redirect to claimant type page for one claimant defendant when everything is fine', async () => {
      draftStoreServiceMock.resolveUpdate()
      draftStoreServiceMock.resolveUpdate()

      await request(app)
        .get(ClaimPaths.claimantRemovePage.uri + '?index=1')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantTypePage.uri))
    })

    it('should return 500 and render error page when cannot save draft', async () => {
      draftStoreServiceMock.rejectSave()

      await request(app)
        .get(ClaimPaths.claimantRemovePage.uri + '?index=1')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })
  })
})
describe('Claim issue: is claimant removal page, multiple claimants', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim', twoClaimants)
    idamServiceMock.resolveRetrieveServiceToken()
    idamServiceMock.resolveRetrieveServiceToken()
    idamServiceMock.resolveRetrieveUserFor('1', ...roles)
  })
  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimantRemovePage.uri)

    it('should redirect to claimant add page for more than one existing claimants when everything is fine', async () => {
      draftStoreServiceMock.resolveUpdate()
      draftStoreServiceMock.resolveUpdate()

      await request(app)
        .get(ClaimPaths.claimantRemovePage.uri + '?index=1')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantAdditionPage.uri))
    })
  })
})
