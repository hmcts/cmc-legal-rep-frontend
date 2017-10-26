import * as config from 'config'
import * as mock from 'nock'
import { Scope } from 'nock'
import * as HttpStatus from 'http-status-codes'
import { PartyTypes } from 'forms/models/partyTypes'

const serviceBaseURL: string = config.get<string>('claim-store.url')

export const sampleClaimObj = {
  id: 1,
  submitterId: '1',
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
  referenceNumber: '000LR001',
  createdAt: '2017-07-25T22:45:51.785',
  issuedOn: '2017-07-25',
  claim: {
    claimants: [{
      address: {
        line1: 'Address Line 1',
        line2: '',
        city: 'London',
        postcode: 'NE8 3BA'
      },
      claimantDetails: {
        type: {
          value: PartyTypes.INDIVIDUAL.dataStoreValue,
          displayValue: 'An individual',
          dataStoreValue: 'individual'
        },
        fullName: 'no name',
        organisation: null,
        companyHouseNumber: null
      },
      type: PartyTypes.INDIVIDUAL.dataStoreValue,
      title: 'Mr',
      name: 'Full Name',
      representative: {
        organisationName: 'test',
        organisationAddress: {
          line1: 'Address Line 1',
          line2: '',
          city: 'City',
          postcode: 'Postcode'
        },
        organisationContactDetails: {}
      }
    }],
    defendants: [{
      address: {
        line1: 'Address Line 1',
        line2: '',
        city: 'London',
        postcode: 'SW1H 9AJ'
      },
      representative: {
        organisationName: 'legal rep',
        organisationAddress: {
          line1: 'LEGAL REP ADD1',
          line2: '',
          city: 'LEGAL REP TOWN',
          postcode: 'SW1H 9DJ'
        },
        organisationContactDetails: {}
      },
      defendantDetails: {
        type: {
          value: PartyTypes.ORGANISATION.dataStoreValue,
          displayValue: 'An organisation',
          dataStoreValue: 'organisation'
        },
        title: null,
        fullName: null,
        organisation: 'defendant org',
        companyHouseNumber: ''
      },
      name: 'defendant org',
      type: PartyTypes.ORGANISATION.dataStoreValue
    }],
    reason: 'Because I can',
    feeAmountInPennies: 7000
  },
  responseDeadline: '2017-08-08'
}

export function resolveRetrieveClaimByExternalId (claimOverride?: object): Scope {
  return mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, ...claimOverride })
}

export function rejectRetrieveClaimByExternalIdWithNotFound (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.NOT_FOUND, reason)
}

export function saveClaimForUser () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj })
}

export function saveClaimForUserFailedWithUniqueConstraint (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+'))
    .reply(HttpStatus.CONFLICT, reason)
}

export function saveClaimForUserFailed (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function rejectRetrieveSealedClaimCopy (reason: string) {
  mock(`${serviceBaseURL}/documents`)
    .get(new RegExp('/legalSealedClaim/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveSealedClaimCopy () {
  mock(`${serviceBaseURL}/documents`)
    .get(new RegExp('/legalSealedClaim/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.OK, [])
}
