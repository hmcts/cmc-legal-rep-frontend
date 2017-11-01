import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import { Fee } from 'fees/model/fee'

const issueFeeCode: string = config.get<string>('fees.issueFeeCode')
const serviceURL: string = `${config.get('fees.url')}/range-groups/${issueFeeCode}/calculations?value=`

const body = {
  amount: 1000000,
  fee: {
    code: 'X0012'
  } as Fee
}

export function resolveCalculateIssueFee (): mock.Scope {
  return resolveCallFeesRegister()
}

export function rejectCalculateIssueFee (reason: string = 'HTTP error') {
  rejectCallFeesRegister(reason)
}

export function resolveCallFeesRegister (): mock.Scope {
  return mock(serviceURL)
    .get(new RegExp(`[0-9]+`))
    .reply(HttpStatus.OK, body)
}

export function rejectCallFeesRegister (reason: string = 'HTTP error') {
  mock(serviceURL)
    .get(new RegExp(`[0-9]+`))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
