import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
const serviceBaseURL: string = config.get<string>('idam.api.url')

export function resolveRetrieveUserFor (id: number, ...roles: string[]) {
  mock(serviceBaseURL)
    .get('/details')
    .reply(HttpStatus.OK, { id: id, roles: roles })
}

export function rejectRetrieveUserFor (reason: string) {
  mock(serviceBaseURL)
    .get('/details')
    .reply(HttpStatus.FORBIDDEN, reason)
}
