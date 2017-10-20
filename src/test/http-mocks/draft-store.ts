import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import { OtherDamages } from 'forms/models/otherDamages'
import { YesNo } from 'forms/models/yesNo'
import { GeneralDamages } from 'forms/models/generalDamages'

const serviceBaseURL: string = `${config.get('draft-store.url')}`

const sampleViewDraftObj = {
  viewFlowOption: true,
  defendantChangeIndex: undefined,
  claimantChangeIndex: undefined
}

const sampleClaimDraftObj = {
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
  readResolveDispute: true,
  readCompletingClaim: true,
  representative: {
    organisationName: 'My Organisation Name',
    address: {
      line1: 'Apt 99',
      line2: 'Building A',
      city: 'London',
      postcode: 'E1'
    }
  },
  claimants: [{
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
    }
  }],
  defendants: [{
    address: {
      line1: 'Apt 99',
      city: 'London',
      postcode: 'E1'
    },
    representative: {
      organisationName: 'Defendant Company Name',
      address: {
        line1: 'Apt 99',
        line2: 'Building A',
        city: 'London',
        postcode: 'E1'
      }
    },
    defendantRepresented: {
      isDefendantRepresented: { value: YesNo.YES.value, displayValue: YesNo.YES.displayValue },
      companyName: 'Defendant rep'
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
  housingDisrepair: {
    housingDisrepair: { value: YesNo.YES.value, displayValue: YesNo.YES.displayValue },
    generalDamages: {
      value: GeneralDamages.LESS.value,
      displayValue: GeneralDamages.LESS.displayValue,
      dataStoreValue: GeneralDamages.LESS.dataStoreValue
    },
    otherDamages: {
      value: OtherDamages.NONE.value,
      displayValue: OtherDamages.NONE.displayValue,
      dataStoreValue: OtherDamages.NONE.dataStoreValue
    }
  },
  personalInjury: {
    personalInjury: { value: YesNo.NO.value, displayValue: YesNo.NO.value },
    generalDamages: undefined
  }
}

export function resolveFind (draftType: string, draftOverride?: object) {
  let documentDocument: object

  switch (draftType) {
    case 'legalClaim':
      documentDocument = { ...sampleClaimDraftObj, ...draftOverride }
      break
    case 'view':
      documentDocument = { ...sampleViewDraftObj, ...draftOverride }
      break
    default:
      throw new Error('Unsupported draft type')
  }

  mock(serviceBaseURL)
    .get(new RegExp('/drafts.*'))
    .reply(HttpStatus.OK, {
      data: [{
        id: 100,
        type: draftType,
        document: documentDocument,
        created: '2017-10-01T12:00:00.000',
        updated: '2017-10-01T12:01:00.000'
      }]
    })
}

export function resolveRetrieveWithExternalId (draftType: string, externalId: any) {
  mock(serviceBaseURL)
    .get(`/draft/${draftType}`)
    .reply(HttpStatus.OK, { ...sampleClaimDraftObj, externalId: externalId })
}

export function rejectFind (reason: string = 'HTTP error') {
  return mock(serviceBaseURL)
    .get(new RegExp('/drafts.*'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveSave () {
  return mock(serviceBaseURL)
    .post(`/drafts`)
    .reply(HttpStatus.OK)
}

export function resolveUpdate (id: number = 100) {
  return mock(serviceBaseURL)
    .put(`/drafts/${id}`)
    .reply(HttpStatus.OK)
}

export function rejectSave (id: number = 100, reason: string = 'HTTP error') {
  return mock(serviceBaseURL)
    .put(`/drafts/${id}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveDelete (id: number = 100) {
  return mock(serviceBaseURL)
    .delete(`/drafts/${id}`)
    .reply(HttpStatus.OK)
}

export function rejectDelete (id: number = 100, reason: string = 'HTTP error') {
  return mock(serviceBaseURL)
    .delete(`/drafts/${id}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
