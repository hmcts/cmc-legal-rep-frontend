import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import './expectations'

import { Paths as AppPaths } from 'paths'

import { app } from '../../main/app'

import * as idamServiceMock from '../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']

describe('Logout receiver', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    it('should redirect to claimant home page', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      await request(app)
        .get('/legal/logout')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(AppPaths.homePage.uri))
    })

    it('should remove session cookie', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', ...roles)
      await request(app)
        .get('/legal/logout')
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.have.cookie(cookieName, ''))
    })
  })
})
