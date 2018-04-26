import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as CertificateOfServicePath } from 'certificateOfService/paths'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

const roles: string[] = ['solicitor']

describe('Remove document', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', CertificateOfServicePath.documentRemovePage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        idamServiceMock.resolveRetrieveServiceToken()
        draftStoreServiceMock.resolveFind('legalCertificateOfService')
      })

      it('should throw forbidden error when trying to access a document not associated with the claim', async () => {
        draftStoreServiceMock.resolveFind('dashboard')
        await request(app)
          .get(CertificateOfServicePath.documentRemovePage.uri + '?id=/documents/85d97996-22a5-40d7-882e-3a382c8ae1b5')
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.forbidden)
      })

      it('should redirect to document upload page after removing an item', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', ...roles)
        idamServiceMock.resolveRetrieveServiceToken()
        draftStoreServiceMock.resolveFind('legalCertificateOfService')
        draftStoreServiceMock.resolveUpdate()
        await request(app)
          .get(CertificateOfServicePath.documentRemovePage.uri + '?id=/documents/85d97996-22a5-40d7-882e-3a382c8ae1b4')
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(CertificateOfServicePath.documentUploadPage.uri))
      })
    })
  })
})
