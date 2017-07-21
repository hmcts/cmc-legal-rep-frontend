import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const serviceBaseURL: string = config.get<string>('claim-store.url')

const sampleClaimObj = {
  id: 1,
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
  referenceNumber: '000MC000',
  claim: {
    claimant: {
      name: {
        first: 'John',
        last: 'Smith'
      },
      payment: {
        id: '12',
        amount: 2500,
        state: { status: 'failed' }
      },
      amount: {
        rows: [{ reason: 'Reason', amount: 200 }]
      },
      interestDate: {
        date: {
          year: 2000,
          month: 2,
          day: 1
        }
      }
    },
    interest: {
      type: 'no interest'
    },
    reason: 'Because I can'
  }
}

const sampleDefendantResponseObj = {
  id: 1,
  claimId: 1,
  defendantId: 1,
  response: {},
  respondedOn: ''
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

export function resolveRetrieveByClaimantId (claimOverride?: object) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/claimant/[0-9]+'))
    .reply(HttpStatus.OK, [{ ...sampleClaimObj, ...claimOverride }])
}

export function resolveRetrieveByClaimantIdToEmptyList () {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/claimant/[0-9]+'))
    .reply(HttpStatus.OK, [])
}

export function rejectRetrieveByClaimantId (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/claimant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveByLetterHolderId (referenceNumber: string, defendantId?: number) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/letter/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, referenceNumber: referenceNumber, defendantId: defendantId })
}

export function rejectRetrieveByLetterHolderId (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/letter/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveByDefendantId (referenceNumber: string, defendantId?: number) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/defendant/[0-9]+'))
    .reply(HttpStatus.OK, [{ ...sampleClaimObj, referenceNumber: referenceNumber, defendantId: defendantId }])
}

export function rejectRetrieveByDefendantId (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/defendant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveLinkDefendant () {
  mock(`${serviceBaseURL}/claims`)
    .put(new RegExp('/[0-9]+/defendant/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, defendantId: 1 })
}

export function rejectLinkDefendant (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .put(new RegExp('/[0-9]+/defendant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveSaveResponse () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+/defendant/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, defendantId: 1 })
}

export function rejectSaveResponse (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+/defendant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveResponsesByDefendantId (defendantResponseOverride?: object) {
  mock(`${serviceBaseURL}/responses/defendant`)
    .get(new RegExp('/[0-9]+'))
    .reply(HttpStatus.OK, [{ ...sampleDefendantResponseObj, ...defendantResponseOverride }])
}

export function resolveRetrieveResponsesByDefendantIdToEmptyList () {
  mock(`${serviceBaseURL}/responses/defendant`)
    .get(new RegExp('/[0-9]+'))
    .reply(HttpStatus.OK, [])
}

export function rejectRetrieveResponseByDefendantId (reason: string) {
  mock(`${serviceBaseURL}/responses/defendant`)
    .get(new RegExp('/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRequestForMoreTime () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+/request-more-time'))
    .reply(HttpStatus.OK)
}

export function rejectRequestForMoreTime (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+/request-more-time'))
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

export function retrieveByExternalId () {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[0-9]+'))
    .reply(HttpStatus.OK, sampleClaimObj)
}

export function retrieveByExternalIdFailed (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function retrieveByExternalIdReturnsEmptyClaim () {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[0-9]+'))
    .reply(HttpStatus.OK, {})
}
