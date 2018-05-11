import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const pageText = 'Has the defendant got a legal representative'
const roles: string[] = ['solicitor']

describe('Claim issue: is defendant represented page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantRepresentedPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.defendantRepresentedPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.defendantRepresentedPage.uri)

    describe('should render page when form is invalid', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        draftStoreServiceMock.resolveUpdate()
        idamServiceMock.resolveRetrieveServiceToken()
      })
      it('defendant represented is not chosen', async () => {
        await request(app)
          .post(ClaimPaths.defendantRepresentedPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'Choose yes if defendant is represented'))
      })
      it('defendant represented is yes and name is empty', async () => {
        const invalidDefendantRepresented = { isDefendantRepresented: 'YES', organisationName: '' }
        await request(app)
          .post(ClaimPaths.defendantRepresentedPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(invalidDefendantRepresented)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'Enter defendant representative organisation name'))
      })
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.defendantRepresentedPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          isDefendantRepresented: 'NO',
          organisationName: 'organisationName'
        })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to defendant rep address page when form is valid and user has selected yes', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveUpdate()

      await request(app)
        .post(ClaimPaths.defendantRepresentedPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          isDefendantRepresented: 'YES',
          organisationName: 'organisationName'
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantRepAddressPage.uri))
    })

    it('should redirect to defendant add page when form is valid and user has selected no', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.defendantRepresentedPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          isDefendantRepresented: 'NO',
          organisationName: undefined
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantServiceAddressPage.uri))
    })
  })
})
