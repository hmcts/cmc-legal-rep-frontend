/* tslint:disable:no-console */

import * as fs from 'fs'
import { request } from 'integration-test/helpers/clients/base/request'
import { RequestResponse } from 'request'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'

const legalAppURL = process.env.LEGAL_APP_URL

class Client {
  static checkHealth (appURL: string): Promise<RequestResponse> {
    return request.get({
      uri: `${appURL}/health`,
      resolveWithFullResponse: true,
      rejectUnauthorized: false,
      ca: fs.readFileSync('./src/integration-test/resources/localhost.crt')
    }).catch((error) => {
      return error
    })
  }
}

// TS:no-
function logStartupProblem (response) {
  if (response.body) {
    console.log(response.body)
  } else if (response.message) {
    console.log(response.message)
  }
}

function handleError (error) {
  const errorBody = () => {
    if (error && error.response) {
      const response = error.response
      return `${response.statusCode} - ${response.statusMessage} - ${response.body}`
    } else {
      return error
    }
  }
  console.log('Error during bootstrap, exiting', errorBody())
  process.exit(1)
}

function sleepFor (sleepDurationInSeconds: number) {
  console.log(`Sleeping for ${sleepDurationInSeconds} seconds`)
  return new Promise((resolve) => {
    setTimeout(resolve, sleepDurationInSeconds * 1000)
  })
}

async function waitTillHealthy (appURL: string) {
  const maxTries = 36
  const sleepInterval = 10

  console.log(`Verifying health for ${appURL}`)

  let response: RequestResponse
  for (let i = 0; i < maxTries; i++) {
    response = await Client.checkHealth(appURL)
    console.log(`Attempt ${i + 1} - received status code ${response.statusCode} from ${appURL}/health`)

    if (response.statusCode === 200) {
      console.log(`Service ${appURL} became ready after ${sleepInterval * i} seconds`)
      return Promise.resolve()
    } else {
      logStartupProblem(response)
      await sleepFor(sleepInterval)
    }
  }

  const error = new Error(`Failed to successfully contact ${appURL} after ${maxTries} attempts`)
  error.message = '' + response
  return Promise.reject(error)
}

async function createSmokeTestsUserIfDoesntExist (username: string, password: string): Promise<void | string> {
  if (!(username || password)) {
    console.log('Username or password not set, skipping create')
    return undefined
  }

  console.log(process.env.SMOKE_TEST_SOLICITOR_USERNAME[0])
  console.log(process.env.SMOKE_TEST_USER_PASSWORD[0])

  try {
    console.log('Attempting to authenticate user: ', username)

    return await IdamClient.authenticateUser(username, password)
  } catch (err) {
    console.log('Failed to authenticate user because of: ', `${err.response.statusCode} - ${err.response.body}`)
    await IdamClient.createUser(username, password)
  }
}

module.exports = async function (done: () => void) {
  try {
    await waitTillHealthy(legalAppURL)
    if (process.env.IDAM_URL) {
      if (process.env.SMOKE_TEST_SOLICITOR_USERNAME) {
        await createSmokeTestsUserIfDoesntExist(process.env.SMOKE_TEST_SOLICITOR_USERNAME, process.env.SMOKE_TEST_USER_PASSWORD)
      }
    }
  } catch (error) {
    handleError(error)
  }
  done()
}
