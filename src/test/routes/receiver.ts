import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import './expectations'

import { Paths as AppPaths } from 'app/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { app } from '../../main/app'
import * as idamServiceMock from '../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')
const roles: string[] = ['solicitor']
const token = 'I am dummy access token'

describe('Claim issue: post login receiver', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    describe('for authorized user', () => {

      it('should save JWT token in cookie', async () => {
        idamServiceMock.resolveRetrieveAuthTokenFor(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC`)
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })

      it('should redirect to start page for jwt when everything is fine', async () => {
        idamServiceMock.resolveRetrieveUserFor(1, ...roles)

        await request(app)
          .get(`${AppPaths.receiver.uri}?jwt=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
      })

      it('should redirect to start page for authToken when everything is fine', async () => {
        idamServiceMock.resolveRetrieveAuthTokenFor(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=code`)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPage.uri))
      })

    })
  })
})
