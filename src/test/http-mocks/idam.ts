import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import ServiceAuthToken from 'idam/serviceAuthToken'
const serviceBaseURL: string = config.get<string>('idam.api.url')
const s2sUrl = config.get<string>('idam.service-2-service-auth.url')

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

export function retrieveServiceToken (token: string) {
  mock(s2sUrl)
    .post('/lease')
    .reply(HttpStatus.OK, new ServiceAuthToken(token))
}
