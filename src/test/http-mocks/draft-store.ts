import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const serviceBaseURL: string = `${config.get('draft-store.url')}/api/${config.get('draft-store.apiVersion')}`

const sampleClaimDraftObj = {
  externalId: '12345',
  readResolveDispute: true,
  readCompletingClaim: true,
  representative: {
    companyName: 'My Company Name',
    address: {
      line1: 'Apt 99',
      line2: 'Building A',
      city: 'London',
      postcode: 'E1'
    }
  },
  claimant: {
    claimantDetails: {
      type: 'INDIVIDUAL',
      title: 'title',
      fullName: 'fullName'
    },
    address: {
      line1: 'Apt 99',
      city: 'London',
      postcode: 'E1'
    },
    dateOfBirth: {
      date: {
        day: '31',
        month: '12',
        year: '1980'
      }
    },
    mobilePhone: {
      number: '07000000000'
    },
    payment: {
      id: '12',
      amount: 2500,
      state: { status: 'failed' }
    }
  },
  defendants: [{
    address: {
      line1: 'Apt 99',
      city: 'London',
      postcode: 'E1'
    },
    representative: {
      companyName: 'Defendant Company Name',
      address: {
        line1: 'Apt 99',
        line2: 'Building A',
        city: 'London',
        postcode: 'E1'
      }
    },
    defendantDetails: {
      type: 'INDIVIDUAL',
      title: 'title',
      fullName: 'fullName'
    }
  }],
  amount: {
    cannotState: '',
    lowerValue: 100,
    higherValue: 1000
  },
  interest: {
    type: 'no interest'
  },
  interestDate: {},
  reason: {
    reason: 'Valid reason'
  }
}

const sampleResponseDraftObj = {
  externalId: '12345',
  response: {
    type: 'OWE_NONE'
  },
  counterClaim: {
    counterClaim: false
  },
  defence: {
    text: 'Some valid defence'
  },
  freeMediation: {
    option: 'no'
  },
  moreTimeNeeded: {
    option: 'yes'
  },
  defendantDetails: {
    name: { first: 'John', middle: '', last: 'Smith' },
    address: { line1: 'Apartment 99', line2: '', city: 'London', postcode: 'SE28 0JE' },
    dateOfBirth: { date: { year: 1978, month: 1, day: 11 } },
    mobilePhone: { number: '07123456789' }
  }
}

export function resolveRetrieve (draftType: string, draftOverride?: object) {
  let draft: object

  switch (draftType) {
    case 'legalClaim':
      draft = { ...sampleClaimDraftObj, ...draftOverride }
      break
    case 'response':
      draft = { ...sampleResponseDraftObj, ...draftOverride }
      break
    default:
      throw new Error('Unsupported draft type')
  }

  mock(serviceBaseURL)
    .get(`/draft/${draftType}`)
    .reply(HttpStatus.OK, draft)
}

export function resolveRetrieveWithExternalId (draftType: string, externalId: any) {
  mock(serviceBaseURL)
    .get(`/draft/${draftType}`)
    .reply(HttpStatus.OK, { ...sampleClaimDraftObj, externalId: externalId })
}

export function rejectRetrieve (draftType: string, reason: string) {
  mock(serviceBaseURL)
    .get(`/draft/${draftType}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveSave (draftType: string) {
  mock(serviceBaseURL)
    .post(`/draft/${draftType}`)
    .reply(HttpStatus.OK)
}

export function rejectSave (draftType: string, reason: string) {
  mock(serviceBaseURL)
    .post(`/draft/${draftType}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveDelete (draftType: string) {
  mock(serviceBaseURL)
    .delete(`/draft/${draftType}`)
    .reply(HttpStatus.OK)
}

export function rejectDelete (draftType: string, reason: string) {
  mock(serviceBaseURL)
    .delete(`/draft/${draftType}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
