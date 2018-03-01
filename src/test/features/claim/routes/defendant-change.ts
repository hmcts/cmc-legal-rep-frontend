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

const defendants = {
  defendants: [{
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
    defendantDetails: {
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
      defendantDetails: {
        type: 'INDIVIDUAL',
        fullName: 'fullName'
      }
    }]
}

describe('Claim issue: Defendant change page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveUpdate()
    idamServiceMock.resolveRetrieveUserFor('1', ...roles)
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantChangePage.uri)

    it('should redirect to defendant type page for one existing defendant when everything is fine', async () => {
      draftStoreServiceMock.resolveFind('legalClaim')
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.defendantChangePage.uri + '?index=1')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantTypePage.uri))
    })

    it('should redirect to defendant address page when everything is fine', async () => {
      draftStoreServiceMock.resolveFind('legalClaim', defendants)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.defendantChangePage.uri + '?index=1&page=address')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantAddressPage.uri))
    })

    it('should redirect to defendant represented page when everything is fine', async () => {
      draftStoreServiceMock.resolveFind('legalClaim', defendants)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.defendantChangePage.uri + '?index=1&page=represented')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantRepresentedPage.uri))
    })

    it('should redirect to defendant represented address page when everything is fine', async () => {
      draftStoreServiceMock.resolveFind('legalClaim', defendants)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.defendantChangePage.uri + '?index=1&page=reps-address')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantRepAddressPage.uri))
    })

    it('should redirect to defendant service address page when everything is fine', async () => {
      draftStoreServiceMock.resolveFind('legalClaim', defendants)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.defendantChangePage.uri + '?index=1&page=service-address')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantServiceAddressPage.uri))
    })

    it('should return 500 and render error page when cannot save draft', async () => {
      draftStoreServiceMock.resolveFind('legalClaim', defendants)
      draftStoreServiceMock.rejectSave()

      await request(app)
        .get(ClaimPaths.defendantChangePage.uri + '?index=1')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })
  })
})
