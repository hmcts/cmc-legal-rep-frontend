import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import * as feesServiceMock from '../../../http-mocks/fees'
import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { sampleClaimObj } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const pageHeading = 'Pay by Fee Account'
const draftType: string = 'legalClaim'
const roles: string[] = ['solicitor']

describe('Claim : Pay by Fee Account page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveRetrieve('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.payByAccountPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, ...roles)
      })

      it('should return 500 and render error page when cannot calculate issue fee', async () => {
        draftStoreServiceMock.resolveRetrieve(draftType)
        feesServiceMock.rejectCalculateIssueFee('HTTP error')

        await request(app)
          .get(ClaimPaths.payByAccountPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveRetrieve(draftType)
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.payByAccountPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageHeading))
      })

    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.payByAccountPage.uri)

    it('should render page when form is invalid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, ...roles)
      feesServiceMock.resolveCalculateIssueFee()

      await request(app)
        .post(ClaimPaths.payByAccountPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ reference: '' })
        .expect(res => expect(res).to.be.successful.withText(pageHeading, 'div class="error-summary"'))
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, ...roles)
      draftStoreServiceMock.rejectSave(draftType, 'HTTP error')

      await request(app)
        .post(ClaimPaths.payByAccountPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ reference: 'PBA1234567' })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to claim submitted page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, ...roles)
      draftStoreServiceMock.resolveSave(draftType)
      feesServiceMock.resolveCalculateIssueFee()
      claimStoreServiceMock.saveClaimForUser()

      await request(app)
        .post(ClaimPaths.payByAccountPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ reference: 'PBA1234567' })
        .expect(res => expect(res).to.be.redirect
          .toLocation(ClaimPaths.claimSubmittedPage.uri.replace(':externalId', sampleClaimObj.externalId)))
    })
  })
})
