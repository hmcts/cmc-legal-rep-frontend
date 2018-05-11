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
const pageText = 'Is it a personal injury claim?'
const roles: string[] = ['solicitor']

describe('Claim issue: personal injury page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.personalInjuryPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.personalInjuryPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.personalInjuryPage.uri)

    describe('should render page with error when personal injury is invalid', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        draftStoreServiceMock.resolveUpdate()
        idamServiceMock.resolveRetrieveServiceToken()
      })
      it('when nothing selected', async () => {
        const personalInjury = { personalInjury: '', generalDamages: { value: 'MORE', displayValue: 'more' } }
        await request(app)
          .post(ClaimPaths.personalInjuryPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(personalInjury)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Choose yes if it’s a personal injury claim'))
      })
      it('when YES is selected but general damages is not', async () => {
        const personalInjury = { personalInjury: 'YES', generalDamages: { value: '', displayValue: '' } }
        await request(app)
          .post(ClaimPaths.personalInjuryPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(personalInjury)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Choose an amount'))
      })
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.personalInjuryPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          personalInjury: 'YES',
          generalDamages: { value: 'MORE', displayValue: 'more' }
        })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to hosing disrepair page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.personalInjuryPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          personalInjury: 'YES',
          generalDamages: { value: 'MORE', displayValue: 'more' }
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.housingDisrepairPage.uri))
    })
  })
})
