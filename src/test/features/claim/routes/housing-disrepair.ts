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
const pageText = 'Is it a claim for housing disrepair'
const roles: string[] = ['solicitor']

describe('Claim issue: housing disrepair page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.housingDisrepairPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.housingDisrepairPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.housingDisrepairPage.uri)

    describe('should render page with error when housing disrepair is invalid', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        draftStoreServiceMock.resolveUpdate()
        idamServiceMock.resolveRetrieveServiceToken()
      })
      it('when nothing selected', async () => {
        const housingDisrepair = { housingDisrepair: '', generalDamages: { value: 'MORE', displayValue: 'more' }, otherDamages: { value: 'NONE', displayValue: 'none' } }
        await request(app)
          .post(ClaimPaths.housingDisrepairPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(housingDisrepair)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Choose yes if the claim is for housing disrepair'))
      })
      it('when YES is selected but general damages nor other damages is not selected', async () => {
        const housingDisrepair = { housingDisrepair: 'YES', generalDamages: { value: '', displayValue: '' }, otherDamages: { value: '', displayValue: '' } }
        await request(app)
          .post(ClaimPaths.housingDisrepairPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(housingDisrepair)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Choose an amount for general damages', 'Choose an amount for other damages'))
      })
      it('when YES is selected and general damages has a value but other damages is not selected', async () => {
        const housingDisrepair = { housingDisrepair: 'YES', generalDamages: { value: 'MORE', displayValue: 'more' }, otherDamages: { value: '', displayValue: '' } }
        await request(app)
          .post(ClaimPaths.housingDisrepairPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(housingDisrepair)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Choose an amount for other damages'))
      })
      it('when YES is selected and other damages has a value but general damages is not selected', async () => {
        const housingDisrepair = { housingDisrepair: 'YES', generalDamages: { value: '', displayValue: '' }, otherDamages: { value: 'NONE', displayValue: 'none' } }
        await request(app)
          .post(ClaimPaths.housingDisrepairPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(housingDisrepair)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Choose an amount for general damages'))
      })
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.housingDisrepairPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          housingDisrepair: 'YES',
          generalDamages: { value: 'MORE', displayValue: 'more' },
          otherDamages: { value: 'NONE', displayValue: 'none' }
        })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to summarise the claim page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.housingDisrepairPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({
          housingDisrepair: 'YES',
          generalDamages: { value: 'MORE', displayValue: 'more' },
          otherDamages: { value: 'NONE', displayValue: 'none' }
        })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.summariseTheClaimPage.uri))
    })
  })
})
