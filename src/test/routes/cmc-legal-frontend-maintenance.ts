import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes/expectations'
import { app } from 'main/app'
import { Paths as AppPaths } from 'paths'

describe('CMC legal frontend maintenance page', () => {
  describe('on GET', () => {
    it('should render maintenance page when everything is fine', async () => {
      await request(app)
        .get('/legal' + AppPaths.cmcLegalFrontendMaintenancePage.uri)
        .expect(res => expect(res).to.be.successful.withText('Sorry, there’s a problem with this service'))

    })
  })
})
