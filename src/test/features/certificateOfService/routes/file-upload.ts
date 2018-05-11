import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import { Paths as CertificateOfServicePath } from 'certificateOfService/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as documentManagementMock from 'test/http-mocks/document-store'
import { checkAuthorizationGuards } from './checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']

describe('Certificate of Service: file upload', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalCertificateOfService')
    draftStoreServiceMock.resolveUpdate().persist()
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', CertificateOfServicePath.fileUploadPage.uri)

    it.skip('should redirect to document upload page when no file is sent', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()

      await request(app)
        .post(CertificateOfServicePath.fileUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should redirect to document upload page after sending a .pdf file to document management', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      documentManagementMock.resolveSave()

      await request(app)
        .post(CertificateOfServicePath.fileUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/resources/000LR012.pdf')
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should redirect to document upload page after sending a .doc file to document management', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      documentManagementMock.resolveSave()

      await request(app)
        .post(CertificateOfServicePath.fileUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/resources/TestFile.doc')
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should redirect to document upload page after sending a .docx file to document management', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      documentManagementMock.resolveSave()

      await request(app)
        .post(CertificateOfServicePath.fileUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/resources/TestFile.docx')
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should redirect to document upload page after sending a .png file to document management', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      documentManagementMock.resolveSave()

      await request(app)
        .post(CertificateOfServicePath.fileUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/resources/TestFile.png')
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should redirect to document upload page after sending a .jpg file to document management', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      documentManagementMock.resolveSave()

      await request(app)
        .post(CertificateOfServicePath.fileUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/resources/TestFile.jpg')
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should redirect to document upload page after sending an unsupported file to document management', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      documentManagementMock.resolveSave()

      await request(app)
        .post(CertificateOfServicePath.fileUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/resources/TestFile.zip')
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should redirect to document upload page after sending a .xls file to document management', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      documentManagementMock.resolveSave()

      await request(app)
        .post(CertificateOfServicePath.fileUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/resources/TestFile.xls')
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should redirect to document upload page after sending a .xlsx file to document management', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      documentManagementMock.resolveSave()

      await request(app)
        .post(CertificateOfServicePath.fileUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/resources/TestFile.xlsx')
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should show error when unable to save a document', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      documentManagementMock.rejectSave()

      await request(app)
        .post(CertificateOfServicePath.fileUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/resources/000LR012.pdf')
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })
  })
})
