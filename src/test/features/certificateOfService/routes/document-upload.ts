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
const pageText = 'Upload your documents'
const roles: string[] = ['solicitor']

describe('Certificate of Service: Document upload page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalCertificateOfService')
    draftStoreServiceMock.resolveFind('legalUploadDocument')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', CertificateOfServicePath.documentUploadPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      await request(app)
        .get(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', CertificateOfServicePath.whatDocumentsPage.uri)

    it('should render page with file upload when fileToUpload is set to particularsOfClaim', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveUpdate()

      await request(app)
        .post(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'particularsOfClaim' })
        .expect(res => expect(res).to.be.successful.withText(pageText, 'Upload your documents'))
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      draftStoreServiceMock.rejectSave(100, 'HTTP error')
      draftStoreServiceMock.resolveUpdate()

      await request(app)
        .post(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'particularsOfClaim' })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })
  })
})
