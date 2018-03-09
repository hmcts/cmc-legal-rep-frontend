import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'

const payUrl = config.get<string>('pay.url')
const payPath = '/' + config.get<string>('pay.path')

const paymentSuccessResponse: object = {
  reference: 'RC-1520-4276-0065-8715',
  status: 'Success',
  date_created: '18-02-2018 17:24:46.477Z'
}

export function resolveCreate () {
  mock(payUrl)
    .post(payPath)
    .reply(HttpStatus.CREATED, { ...paymentSuccessResponse })
}

export function rejectCreate () {
  mock(payUrl)
    .post(payPath)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}
