import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const pageText = 'Choose claimant type'
const roles: string[] = ['solicitor']

describe('Claim issue: claimant type page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimantTypePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.claimantTypePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.claimantTypePage.uri)

    describe('should render page with error when claimant type is invalid', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        idamServiceMock.resolveRetrieveServiceToken()
      })
      it('type is not selected', async () => {
        const claimantType = { type: '', title: '', fullName: '', organisation: '', companyHouseNumber: '' }
        await request(app)
          .post(ClaimPaths.claimantTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(claimantType)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'Choose a type of claimant'))
      })
      it('type is INDIVIDUAL and full name not entered', async () => {
        const claimantType = { type: 'INDIVIDUAL', title: '', fullName: '', organisation: '', companyHouseNumber: '' }
        await request(app)
          .post(ClaimPaths.claimantTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(claimantType)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'Enter a full name'))
      })
      it('type is ORGANISATION and organisation not entered', async () => {
        const claimantType = { type: 'ORGANISATION', title: '', fullName: '', organisation: '', companyHouseNumber: '' }
        await request(app)
          .post(ClaimPaths.claimantTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(claimantType)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'Enter an organisation name'))
      })
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.claimantTypePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          type: 'INDIVIDUAL',
          title: 'Mr',
          fullName: 'Peter Pan'
        })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to claimant address page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.claimantTypePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          type: 'INDIVIDUAL',
          title: 'Mr',
          fullName: 'Peter Pan'
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantAddressPage.uri))
    })
  })
})
