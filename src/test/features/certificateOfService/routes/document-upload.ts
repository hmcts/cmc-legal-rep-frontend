import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { Paths as CertificateOfServicePath } from 'certificateOfService/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { FileUploadErrors } from 'forms/models/fileTypeErrors'

const cookieName: string = config.get<string>('session.cookieName')
const pageText = 'Upload your documents'
const roles: string[] = ['solicitor']

describe('Certificate of Service: Document upload page', () => {

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', CertificateOfServicePath.documentUploadPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalCertificateOfService')
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .get(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageText))
    })

    it('should render page when the user has selected to upload particulars of claim', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalCertificateOfService')
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .get(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'PARTICULARS_OF_CLAIM' })
        .expect(res => expect(res).to.be.successful.withText('<input type="submit"'))
    })

    it('should render page when the user has selected to upload medical report', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalCertificateOfService')
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .get(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'MEDICAL_REPORTS' })
        .expect(res => expect(res).to.be.successful.withText('<input type="submit"'))
    })

    it('should render page when the user has selected to upload Schedule of loss', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalCertificateOfService')
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .get(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'SCHEDULE_OF_LOSS' })
        .expect(res => expect(res).to.be.successful.withText('<input type="submit"'))
    })

    it('should render page when the user has selected to upload Other files', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalCertificateOfService')
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .get(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'OTHER' })
        .expect(res => expect(res).to.be.successful.withText('<input type="submit"'))
    })

    it('should show an error when the user clicks Upload file with no file selected', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalCertificateOfService', {
        fileToUploadError: { value: 'FILE_REQUIRED', displayValue: 'Select ‘choose file’ before you upload', dataStoreValue: 'fileRequired' }
      })
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .get(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(FileUploadErrors.FILE_REQUIRED.displayValue))
    })

    it('should show an error when the user clicks Upload file with a file that is too large', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalCertificateOfService', {
        fileToUploadError: { value: 'FILE_TOO_LARGE', displayValue: 'Choose a file sized 10MB or smaller', dataStoreValue: 'fileTooLarge' }
      })
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .get(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(FileUploadErrors.FILE_TOO_LARGE.displayValue))
    })

    it('should show an error when the user clicks Upload file with a file that is not supported', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveFind('legalCertificateOfService', {
        fileToUploadError: { value: 'WRONG_FILE_TYPE', displayValue: 'We can’t accept the file type you chose.', dataStoreValue: 'wrongFileType' }
      })
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .get(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(FileUploadErrors.WRONG_FILE_TYPE.displayValue))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', CertificateOfServicePath.whatDocumentsPage.uri)

    it('should reload the page when user clicks add files for particulars of claim', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveUpdate()
      draftStoreServiceMock.resolveFind('legalCertificateOfService')
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .post(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'PARTICULARS_OF_CLAIM' })
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should reload the page when user clicks add files for medical report', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveUpdate()
      draftStoreServiceMock.resolveFind('legalCertificateOfService')
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .post(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'MEDICAL_REPORTS' })
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should reload the page when user clicks add files for schedule of loss', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveUpdate()
      draftStoreServiceMock.resolveFind('legalCertificateOfService')
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .post(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'SCHEDULE_OF_LOSS' })
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should reload the page when user clicks add files for other', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveUpdate()
      draftStoreServiceMock.resolveFind('legalCertificateOfService')
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .post(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'OTHER' })
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.rejectSave()
      draftStoreServiceMock.resolveFind('legalCertificateOfService')
      draftStoreServiceMock.resolveFind('dashboard')

      await request(app)
        .post(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ fileToUpload: 'particularsOfClaim' })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })
  })
})
