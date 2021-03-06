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
const pageText = 'Address for service'
const roles: string[] = ['solicitor']

describe("Claim issue: Defendant's service address page", () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantServiceAddressPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .get(ClaimPaths.defendantServiceAddressPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.defendantServiceAddressPage.uri)

    it('should render page when form is invalid', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.defendantServiceAddressPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"'))
    })

    describe('should render page with error when claimant type is invalid', async () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        draftStoreServiceMock.resolveUpdate()
        draftStoreServiceMock.resolveUpdate()
        idamServiceMock.resolveRetrieveServiceToken()
      })
      it('type is not selected', async () => {
        const serviceAddress = { defendantsAddress: '', line1: 'Apartment 99', line2: '', city: 'LONDON', postcode: 'SE28 0JE' }
        await request(app)
          .post(ClaimPaths.defendantServiceAddressPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(serviceAddress)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Choose which address to use'))
      })
      it('line 1 is missing', async () => {
        const serviceAddress = { defendantsAddress: 'NO', line1: '', line2: '', city: 'London', postcode: 'SE28 0JE' }
        await request(app)
          .post(ClaimPaths.defendantServiceAddressPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(serviceAddress)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Enter address line 1'))
      })
      it('town or city is missing', async () => {
        const serviceAddress = { defendantsAddress: 'NO', line1: 'Apartment 99', line2: '', city: '', postcode: 'SE28 0JE' }
        await request(app)
          .post(ClaimPaths.defendantServiceAddressPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(serviceAddress)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Enter a town or city'))
      })
      it('postcode is missing', async () => {
        const serviceAddress = { defendantsAddress: 'NO', line1: 'Apartment 99', line2: '', city: 'London', postcode: '' }
        await request(app)
          .post(ClaimPaths.defendantServiceAddressPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send(serviceAddress)
          .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', 'Enter a postcode'))
      })
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(ClaimPaths.defendantServiceAddressPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ defendantsAddress: 'NO', line1: 'Apt 99', line2: '', city: 'London', postcode: 'SW1A 1AA' })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to defendant addition page when user selects to use the defendants address option', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.defendantServiceAddressPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ defendantsAddress: 'YES' })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantAdditionPage.uri))
    })

    it('should redirect to defendant addition page when form is valid and address filled in', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(ClaimPaths.defendantServiceAddressPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ defendantsAddress: 'NO', line1: 'Apt 99', line2: '', city: 'London', postcode: 'SW1A 1AA' })
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.defendantAdditionPage.uri))
    })
  })
})
