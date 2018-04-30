import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import './expectations'
import { app } from '../../main/app'
import { Paths } from 'app/paths'

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
