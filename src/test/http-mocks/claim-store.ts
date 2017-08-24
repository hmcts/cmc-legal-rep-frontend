import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const serviceBaseURL: string = config.get<string>('claim-store.url')

export const sampleClaimObj = {
  id: 1,
  claimantId: 1,
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
  referenceNumber: '000LR001',
  createdAt: '2017-07-25T22:45:51.785',
  issuedOn: '2017-07-25',
  claim: {
    claimant: {
      name: 'John Smith',
      amount: {
        type: 'range',
        lowerValue: 100,
        higherValue: 300
      }
    },
    defendant: [{
      name: 'John Doe',
      address: {
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'bb127nq'
      }
    }],
    reason: 'Because I can',
    feeAmountInPennies: 7000
  },
  responseDeadline: '2017-08-08'
}

export function resolveRetrieveClaimByExternalId (claimOverride?: object) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, ...claimOverride })
}

export function rejectRetrieveClaimByExternalId (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function saveClaimForUser () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj })
}

export function saveClaimForUserFailed (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
