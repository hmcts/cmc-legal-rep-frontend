import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'

const payUrl = config.get<string>('pay.url')
const payPath = '/' + config.get<string>('pay.path')

const paymentSuccessResponse: object = {
  status: 'Success',
  amount: 60,
  description: 'Money Claim issue fee',
  reference: 'RC-1520-4276-0065-8715',
  payment_reference: 'RC-1520-4276-0065-8715',
  currency: 'GBP',
  ccd_case_number: 'UNKNOWN',
  case_reference: 'dfd75bac-6d54-4c7e-98f7-50e047d7c7f5',
  channel: 'online',
  method: 'card',
  external_provider: 'gov pay',
  external_reference: 'solicitor reference',
  site_id: 'AA00',
  service_name: 'Civil Money Claims',
  fees: [
    {
      code: 'X0026',
      version: '1',
      calculated_amount: 60
    }],
  _links: {
    self: { href: 'http://localhost:4421/card-payments/RC-1520-4276-0065-8715', method: 'GET' }
  }
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
