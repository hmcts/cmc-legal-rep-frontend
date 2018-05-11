import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'
import { app } from 'main/app'
import { Paths } from 'paths'

const site: string = config.get<string>('legal_frontend_analytics')

describe('Logout receiver', () => {
  describe('on GET', () => {
    it('should send analytics config', () =>
      request(app)
        .get('/legal' + Paths.analyticsReceiver.uri)
        .expect(res => expect(res).to.be.successful.withText(JSON.stringify(site)))
    )
  })
})
