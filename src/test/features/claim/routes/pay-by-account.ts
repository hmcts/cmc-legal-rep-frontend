import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import * as feesServiceMock from 'test/http-mocks/fees'
import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as payClientMock from 'test/http-mocks/pay'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const pageHeading = 'Pay by Fee Account'
const draftType: string = 'legalClaim'
const roles: string[] = ['solicitor']

describe('Claim : Pay by Fee Account page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.payByAccountPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        idamServiceMock.resolveRetrieveServiceToken()
      })

      it('should return 500 and render error page when cannot calculate issue fee', async () => {
        draftStoreServiceMock.resolveFind(draftType)
        feesServiceMock.rejectCalculateIssueFee('HTTP error')

        await request(app)
          .get(ClaimPaths.payByAccountPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveFind(draftType)
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
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      feesServiceMock.resolveCalculateIssueFee()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.payByAccountPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ reference: '' })
        .expect(res => expect(res).to.be.successful.withText(pageHeading, 'div class="error-summary"', 'Enter your Fee Account number'))
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.rejectSave(100, 'HTTP error')
      feesServiceMock.resolveCalculateIssueFee()
      claimStoreServiceMock.resolveRetrievePaymentReference()
      payClientMock.resolveCreate()

      await request(app)
        .post(ClaimPaths.payByAccountPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ reference: 'PBA1234567' })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should not issue claim if pay by account is failed', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      feesServiceMock.resolveCalculateIssueFee()
      claimStoreServiceMock.rejectRetrieveClaimByExternalIdWithNotFound('missing claim as submitted claim transaction is not complete')
      claimStoreServiceMock.resolveRetrievePaymentReference()
      idamServiceMock.resolveRetrieveServiceToken()
      payClientMock.rejectCreate()

      await request(app)
        .post(ClaimPaths.payByAccountPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ reference: 'PBA1234567' })
        .expect(res => expect(res).to.be.serverError.withText('Error'))

    })
  })
})
