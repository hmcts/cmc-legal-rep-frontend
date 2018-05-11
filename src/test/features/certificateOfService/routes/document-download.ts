import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/certificateOfService/routes/checks/authorization-check'

import { Paths as CertificateOfServicePath } from 'certificateOfService/paths'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as documentManagementMock from 'test/http-mocks/document-store'

const cookieName: string = config.get<string>('session.cookieName')

const roles: string[] = ['solicitor']

describe('Get saved document', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', CertificateOfServicePath.documentDownloadPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      })

      it('should return 500 and render error page when cannot download the document', async () => {
        documentManagementMock.resolveFindMetaData()
        documentManagementMock.rejectGetDocument()

        await request(app)
          .get(CertificateOfServicePath.documentDownloadPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return the document when everything is fine', async () => {
        idamServiceMock.resolveRetrieveServiceToken()
        draftStoreServiceMock.resolveFind('legalCertificateOfService')
        documentManagementMock.resolveFindMetaData()
        documentManagementMock.resolveGetDocument()

        await request(app)
          .get(CertificateOfServicePath.documentDownloadPage.uri + '?id=/documents/85d97996-22a5-40d7-882e-3a382c8ae1b4')
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful)
      })

      it('should throw forbidden error when trying to access a document not associated with the claim', async () => {
        idamServiceMock.resolveRetrieveServiceToken()
        draftStoreServiceMock.resolveFind('legalCertificateOfService')
        documentManagementMock.resolveFindMetaData()
        documentManagementMock.resolveGetDocument()

        await request(app)
          .get(CertificateOfServicePath.documentDownloadPage.uri + '?id=/documents/85d97996-22a5-40d7-882e-3a382c8ae1b5')
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.forbidden)
      })
    })
  })
})
