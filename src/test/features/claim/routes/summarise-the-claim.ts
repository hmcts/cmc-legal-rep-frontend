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
const pageText = 'Briefly describe the claim'
const roles: string[] = ['solicitor']

describe('Claim issue: Briefly describe the claim page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
    idamServiceMock.resolveRetrieveUserFor('1', ...roles)
    idamServiceMock.resolveRetrieveServiceToken()
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.summariseTheClaimPage.uri)

    it('should render page when everything is fine', async () => {
      await request(app)
        .get(ClaimPaths.summariseTheClaimPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.summariseTheClaimPage.uri)
    beforeEach(() => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
    })

    it('should render page when form is invalid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      await request(app)
        .post(ClaimPaths.summariseTheClaimPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ text: '' })
        .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Enter a brief description of the claim'))
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.summariseTheClaimPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          text: 'summary of claim'
        })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to claim amount page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()

      await request(app)
        .post(ClaimPaths.summariseTheClaimPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          text: 'summary of claim'
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimAmountPage.uri))
    })
  })
})
