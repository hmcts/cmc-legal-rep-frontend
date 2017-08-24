import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'
import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as feesServiceMock from '../../../http-mocks/fees'

const cookieName: string = config.get<string>('session.cookieName')
const pageHeading: string = 'Your issue fee'
const draftType: string = 'legalClaim'
const roles: string[] = ['solicitor']

describe('Claim issue: Your issue fee page', () => {

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimTotalPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, ...roles)
      })

      it('should return 500 and render error page when cannot calculate issue fee', async () => {
        draftStoreServiceMock.resolveRetrieve(draftType)
        feesServiceMock.rejectCalculateIssueFee('HTTP error')

        await request(app)
          .get(ClaimPaths.claimTotalPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveRetrieve(draftType)
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.claimTotalPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageHeading))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.claimTotalPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, ...roles)
      })

      it('should redirect to claim summary page when everything is fine', async () => {
        draftStoreServiceMock.resolveRetrieve(draftType)

        await request(app)
          .post(ClaimPaths.claimTotalPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({})
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.detailsSummaryPage.uri))
      })

    })
  })
})
