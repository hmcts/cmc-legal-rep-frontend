import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import './expectations'

import { Paths as AppPaths } from 'app/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { app } from '../../main/app'
import * as idamServiceMock from '../http-mocks/idam'
import { attachDefaultHooks } from './hooks'

const cookieName: string = config.get<string>('session.cookieName')
const token = 'I am dummy access token'

describe('Claim issue: post login receiver', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-solicitor')
      })

      it('should save JWT token in cookie', async () => {
        idamServiceMock.resolveRetrieveAuthTokenFor(token)

        await request(app)
          .get(`${AppPaths.receiver.uri}?code=ABC`)
          .expect(res => expect(res).to.have.cookie(cookieName, token))
      })

      it('should not remove bearer token saved in cookie when code does not exist in query string', async () => {

        await request(app)
          .get(AppPaths.receiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.not.have.cookie(cookieName, ''))
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
