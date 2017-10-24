import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const serviceBaseURL: string = config.get<string>('idam.api.url')
const defaultServiceAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpZGFtIiwiaWF0IjoxNDgzMjI4ODAwLCJleHAiOjQxMDI0NDQ4MDAsImF1ZCI6ImNtYyIsInN1YiI6ImNtYyJ9.Q9-gf315saUt007Gau0tBUxevcRwhEckLHzC82EVGIM' // valid until 1st Jan 2100

export function resolveRetrieveUserFor (id: string, ...roles: string[]) {
  mock(serviceBaseURL)
    .get('/details')
    .reply(HttpStatus.OK, { id: id, roles: roles })
}

export function resolveRetrieveAuthTokenFor (token: string = defaultServiceAuthToken) {

  mock(serviceBaseURL)
    .post(new RegExp('/oauth2/token'))
    .reply(HttpStatus.OK, {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 28800
    })
}

export function rejectRetrieveUserFor (reason: string) {
  mock(serviceBaseURL)
    .get('/details')
    .reply(HttpStatus.FORBIDDEN, reason)
}
