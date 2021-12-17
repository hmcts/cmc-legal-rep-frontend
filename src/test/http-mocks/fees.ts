import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const service = config.get<string>('fees.service')
const jurisdiction1 = config.get<string>('fees.jurisdiction1')
const jurisdiction2 = config.get<string>('fees.jurisdiction2')
const defaultChannel = config.get<string>('fees.channel.paper')
const issueEvent = config.get<string>('fees.issueFee.event')
const issueFeeKeyword = config.get<string>('fees.issueFee.keyword')
const baseFeeUri = config.get<string>('fees.url')

const feeResponse = {
  code: 'X0008-1',
  description: 'Civil Court fees - Money Claims - Claim Amount - 10000.01 up to 200000 GBP.',
  version: 1,
  fee_amount: 10000
}

export function resolveCalculateIssueFee (): mock.Scope {
  return mock(baseFeeUri)
    .get(`/fees-register/fees/lookup`)
    .query({
      service: `${service}`,
      jurisdiction1: `${jurisdiction1}`,
      jurisdiction2: `${jurisdiction2}`,
      channel: `${defaultChannel}`,
      event: `${issueEvent}`,
      keyword: `${issueFeeKeyword}`,
      amount_or_volume: new RegExp(`[\\d]+`)
    })
    .reply(HttpStatus.OK, feeResponse)
}

export function rejectCalculateIssueFee (reason: string = 'HTTP error') {
  return mock(baseFeeUri)
    .get(`/fees-register/fees/lookup`)
    .query({
      service: `${service}`,
      jurisdiction1: `${jurisdiction1}`,
      jurisdiction2: `${jurisdiction2}`,
      channel: `${defaultChannel}`,
      event: `${issueEvent}`,
      keyword: `${issueFeeKeyword}`,
      amount_or_volume: new RegExp(`[\\d]+`)
    })
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
