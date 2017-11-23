import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import { Paths as CertificateOfServicePath } from 'certificateOfService/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { checkAuthorizationGuards } from './checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')
const pageText = 'What documents did you serve?'
const roles: string[] = ['solicitor']

describe('Certificate of Service: What documents page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalCertificateOfService')
    draftStoreServiceMock.resolveFind('legalUploadDocument')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', CertificateOfServicePath.whatDocumentsPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      await request(app)
        .get(CertificateOfServicePath.whatDocumentsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', CertificateOfServicePath.whatDocumentsPage.uri)

    it('should render page when form is invalid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      await request(app)
        .post(CertificateOfServicePath.whatDocumentsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ types: ['other'], other: undefined })
        .expect(res => expect(res).to.be.successful.withText(pageText, 'div class="error-summary"', pageText))
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')

      await request(app)
        .post(CertificateOfServicePath.whatDocumentsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ types: ['medicalReports'], other: undefined })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })

    it('should redirect to document upload page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.resolveUpdate()
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(CertificateOfServicePath.whatDocumentsPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })
  })
})
