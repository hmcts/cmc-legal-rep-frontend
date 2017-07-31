import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import '../../../routes/expectations'
import { checkAuthorizationGuards } from '../../../routes/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: is defendant represented page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveRetrieve('claim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantRepresentedPage.uri, new RegExp('http://localhost:8000/login\\?continue-url=http://127.0.0.1:[0-9]{1,5}/claim/receiver'))

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')

      await request(app)
        .get(ClaimPaths.defendantRepresentedPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Is the defendant represented?'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.defendantRepresentedPage.uri, new RegExp('http://localhost:8000/login\\?continue-url=http://127.0.0.1:[0-9]{1,5}/claim/receiver'))

    it('should render page when form is invalid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')

      await request(app)
        .post(ClaimPaths.defendantRepresentedPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Is the defendant represented?', 'div class="error-summary"'))
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      draftStoreServiceMock.rejectSave('claim', 'HTTP error')

      await request(app)
        .post(ClaimPaths.defendantRepresentedPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          isDefendantRepresented: 'NO',
          companyName: 'companyName'
        })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to defendant rep address page when form is valid and user has selected yes', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      draftStoreServiceMock.resolveSave('claim')

      await request(app)
        .post(ClaimPaths.defendantRepresentedPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          isDefendantRepresented: 'YES',
          companyName: 'companyName'
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantRepAddressPage.uri))
    })

    it('should redirect to personal injury page when form is valid and user has selected no', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      draftStoreServiceMock.resolveSave('claim')

      await request(app)
        .post(ClaimPaths.defendantRepresentedPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          isDefendantRepresented: 'NO',
          companyName: undefined
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.personalInjuryPage.uri))
    })
  })
})
