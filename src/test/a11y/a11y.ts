import * as supertest from 'supertest'
import * as pa11y from 'pa11y'
import * as promisify from 'es6-promisify'
import { expect } from 'chai'

import { app } from '../../main/app'

const agent = supertest.agent(app)
const pa11yTest = pa11y({
  verifyPage: '<title>((?!error).)*<\/title>' // Pages with error word in page title will fail immediately
})
const test = promisify(pa11yTest.run, pa11yTest)

function check (page: string, url: string): void {
  describe(`Page '${page}' (${url})`, () => {

    it('should have no accessibility errors', (done) => {
      test(agent.get(url).url)
        .then((messages) => {
          const errors = messages.filter((m) => m.type === 'error')
          /* tslint:disable:no-unused-expression */
          // need a better solution at some point, https://github.com/eslint/eslint/issues/2102

          expect(errors, `\n${JSON.stringify(errors, null, 2)}\n`).to.be.empty
          /* tslint:enable:no-unused-expression */
          done()
        })
        .catch((err) => done(err))
    })
  })
}

describe('Accessibility', () => {
  check('Issue civil court proceedings', '/claim/start'),
  check('Is it a personal injury claim?', '/claim/personal-injury'),
  check('Is it a claim for housing disrepair?', '/claim/housing-disrepair'),
  check('Summarise the claim', '/claim/summarise-the-claim')
})
