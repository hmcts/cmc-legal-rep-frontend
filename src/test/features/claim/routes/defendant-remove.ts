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

const twoDefendants = {
  defendants: [{
    address: {
      line1: 'Apt 99',
      city: 'London',
      postcode: 'E1'
    },
    representative: {
      companyName: 'Defendant Company Name',
      address: {
        line1: 'Apt 99',
        line2: 'Building A',
        city: 'London',
        postcode: 'E1'
      }
    },
    defendantDetails: {
      type: 'INDIVIDUAL',
      title: 'title',
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
        companyName: 'Defendant Company Name',
        address: {
          line1: 'Apt 99',
          line2: 'Building A',
          city: 'London',
          postcode: 'E1'
        }
      },
      defendantDetails: {
        type: 'INDIVIDUAL',
        title: 'title',
        fullName: 'fullName'
      }
    }]
}

describe('Claim issue: is defendant removal page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveRetrieve('view')
    idamServiceMock.resolveRetrieveUserFor(1, ...roles)
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantRemovePage.uri)

    it('should redirect to defendant type page for one existing defendant when everything is fine', async () => {
      draftStoreServiceMock.resolveRetrieve('legalClaim')
      draftStoreServiceMock.resolveSave('legalClaim')
      draftStoreServiceMock.resolveSave('view')

      await request(app)
        .get(ClaimPaths.defendantRemovePage.uri + '?index=1')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantTypePage.uri))
    })

    it('should redirect to defendant add page for more than one existing defendants when everything is fine', async () => {

      draftStoreServiceMock.resolveRetrieve('legalClaim', twoDefendants)
      draftStoreServiceMock.resolveSave('legalClaim')
      draftStoreServiceMock.resolveSave('view')

      await request(app)
        .get(ClaimPaths.defendantRemovePage.uri + '?index=1')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantAdditionPage.uri))
    })
  })
})
