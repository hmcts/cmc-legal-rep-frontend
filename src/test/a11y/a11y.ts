/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
import * as config from 'config'
import * as supertest from 'supertest'
import * as pa11y from 'pa11y'
import { expect } from 'chai'

import { RoutablePath } from 'shared/router/routablePath'
import { Paths as ClaimIssuePaths } from 'claim/paths'

import 'test/a11y/mocks'
import { app } from 'main/app'

app.locals.csrf = 'dummy-token'

const cookieName: string = config.get<string>('session.cookieName')

const agent = supertest.agent(app)

interface Issue {
  type
}

async function runPa11y (url: string): Promise<Issue[]> {
  const result = await pa11y(url, {
    headers: {
      Cookie: `${cookieName}=ABC`
    },
    chromeLaunchConfig: {
      args: ['--no-sandbox']
    }
  })
  return result.issues
}

function check (uri: string): void {
  describe(`Page ${uri}`, () => {

    it('should have no accessibility errors', async () => {
      await ensurePageCallWillSucceed(uri)

      const issues: Issue[] = await runPa11y(agent.get(uri).url)

      const errors: Issue[] = issues.filter((issue: Issue) => issue.type === 'error')
      expect(errors, `\n${JSON.stringify(errors, null, 2)}\n`).to.be.empty
    })
  })
}

function ensurePageCallWillSucceed (uri: string): Promise<void> {
  return agent.get(uri)
    .set('Cookie', `${cookieName}=ABC;state=000LR000`)
    .then((res: supertest.Response) => {
      if (res.redirect) {
        throw new Error(`Call to ${uri} resulted in a redirect to ${res.get('Location')}`)
      }
      if (res.serverError) {
        throw new Error(`Call to ${uri} resulted in internal server error`)
      }
    })
}

const excludedPaths: ClaimIssuePaths[] = [
  ClaimIssuePaths.defendantRemovePage,
  ClaimIssuePaths.claimantRemovePage,
  ClaimIssuePaths.defendantChangePage,
  ClaimIssuePaths.claimantChangePage,
  ClaimIssuePaths.receiptReceiver
]

describe('Accessibility', () => {
  function checkPaths (pathsRegistry: object): void {
    Object.values(pathsRegistry).forEach((path: RoutablePath) => {
      const excluded = excludedPaths.some(_ => _ === path)
      if (!excluded) {
        if (path.uri.includes(':externalId')) {
          check(path.evaluateUri({ externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc' }))
        } else {
          check(path.uri)
        }
      }
    })
  }

  checkPaths(ClaimIssuePaths)
})
