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
const pageText = 'Enter claimant name'
const roles: string[] = ['solicitor']

describe('Claim issue: claimant name page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimantNamePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.claimantNamePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.claimantNamePage.uri)

    describe('should render page with error when claimant name is invalid', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        idamServiceMock.resolveRetrieveServiceToken()
      })
      it('name not entered', async () => {
        const claimantName = { fullName: '' }
        await request(app)
          .post(ClaimPaths.claimantNamePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(claimantName)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'Enter a name'))
      })
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.claimantNamePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          fullName: 'Peter Pan'
        })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to claimant address page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.claimantNamePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          fullName: 'Peter Pan'
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantAddressPage.uri))
    })
  })
})
