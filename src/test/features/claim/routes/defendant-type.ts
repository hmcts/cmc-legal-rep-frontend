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
const pageText = 'Choose defendant type'
const roles: string[] = ['solicitor']

describe('Claim issue: defendant type page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantTypePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.defendantTypePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.housingDisrepairPage.uri)

    describe('should render page with error when defendant type is invalid', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        idamServiceMock.resolveRetrieveServiceToken()
      })
      it('type is not selected', async () => {
        const claimantType = { type: '', title: '', fullName: '', organisation: '', companyHouseNumber: '' }
        await request(app)
          .post(ClaimPaths.defendantTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(claimantType)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'Choose a type of defendant'))
      })
      it('type is INDIVIDUAL and full name not entered', async () => {
        const claimantType = { type: 'INDIVIDUAL', title: '', fullName: '', organisation: '', companyHouseNumber: '' }
        await request(app)
          .post(ClaimPaths.defendantTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(claimantType)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'Enter a full name'))
      })
      it('type is ORGANISATION and organisation not entered', async () => {
        const claimantType = { type: 'ORGANISATION', title: '', fullName: '', organisation: '', companyHouseNumber: '' }
        await request(app)
          .post(ClaimPaths.defendantTypePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(claimantType)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'Enter an organisation name'))
      })
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.defendantTypePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          type: 'INDIVIDUAL',
          fullName: 'fullName'
        })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to defendant address page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.defendantTypePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          type: 'INDIVIDUAL',
          fullName: 'fullName'
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantAddressPage.uri))
    })
  })
})
