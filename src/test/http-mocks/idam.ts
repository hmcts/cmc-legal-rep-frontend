import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const serviceBaseURL: string = config.get<string>('idam.api.url')

export function resolveRetrieveUserFor (id: number, ...roles: string[]) {
  mock(serviceBaseURL)
    .get('/details')
    .reply(HttpStatus.OK, { id: id, roles: roles })
}

export function resolveRetrieveAuthTokenFor (token: string) {

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
