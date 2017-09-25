import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import { OtherDamages } from 'forms/models/otherDamages'
import { YesNo } from 'forms/models/yesNo'
import { GeneralDamages } from 'forms/models/generalDamages'

const serviceBaseURL: string = `${config.get('draft-store.url')}/api/${config.get('draft-store.apiVersion')}`

const sampleViewDraftObj = {
  viewFlowOption: true,
  defendantChangeIndex: undefined
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
    generalDamages: { value: GeneralDamages.LESS.value, displayValue: GeneralDamages.LESS.displayValue, dataStoreValue: GeneralDamages.LESS.dataStoreValue },
    otherDamages: { value: OtherDamages.NONE.value, displayValue: OtherDamages.NONE.displayValue, dataStoreValue: OtherDamages.NONE.dataStoreValue }
  },
  personalInjury: {
    personalInjury: { value: YesNo.NO.value, displayValue: YesNo.NO.value },
    generalDamages: undefined
  }
}

export function resolveRetrieve (draftType: string, draftOverride?: object) {
  let draft: object

  switch (draftType) {
    case 'legalClaim':
      draft = { ...sampleClaimDraftObj, ...draftOverride }
      break
    case 'view':
      draft = { ...sampleViewDraftObj, ...draftOverride }
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
