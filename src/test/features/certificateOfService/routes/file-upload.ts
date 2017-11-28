import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import { Paths as CertificateOfServicePath } from 'certificateOfService/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as documentManagementMock from '../../../http-mocks/document-store'
import { checkAuthorizationGuards } from './checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']

describe('Certificate of Service: file upload', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveFind('legalCertificateOfService')
    draftStoreServiceMock.resolveFind('legalUploadDocument')
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', CertificateOfServicePath.fileUploadPage.uri)

    it('should redirect to document upload page when no file is sent', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveUpdate()

      await request(app)
        .post(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should redirect to document upload page after sending a file to document management', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      draftStoreServiceMock.resolveUpdate()
      documentManagementMock.resolveSave()

      await request(app)
        .post(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/features/certificateOfService/routes/000LR001.pdf')
        .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
    })

    it('should show error when unable to save a document', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      idamServiceMock.resolveRetrieveServiceToken()
      documentManagementMock.rejectSave()

      await request(app)
        .post(CertificateOfServicePath.documentUploadPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .attach('file', 'src/test/features/certificateOfService/routes/000LR001.pdf')
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })
  })
})
