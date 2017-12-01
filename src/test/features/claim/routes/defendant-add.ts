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
const pageText = 'Do you want to add another defendant?'
const roles: string[] = ['solicitor']

describe('Claim issue: is defendant addition page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
    draftStoreServiceMock.resolveFind('view')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantAdditionPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.defendantAdditionPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.defendantAdditionPage.uri)

    it('should render page when form is invalid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.defendantAdditionPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText, 'Choose yes if need to add another defendant'))
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.defendantAdditionPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          isAddDefendant: 'YES'
        })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to defendant type page when form is valid and user has selected yes', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.defendantAdditionPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          isAddDefendant: 'YES'
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantTypePage.uri))
    })

    it('should redirect to personal injury page when form is valid and user has selected no', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.defendantAdditionPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          isAddDefendant: 'NO'
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.personalInjuryPage.uri))
    })
  })
})
