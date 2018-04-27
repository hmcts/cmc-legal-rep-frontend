import * as config from 'config'
import * as mock from 'nock'

import * as HttpStatus from 'http-status-codes'
import { OtherDamages } from 'forms/models/otherDamages'
import { YesNo } from 'forms/models/yesNo'
import { GeneralDamages } from 'forms/models/generalDamages'
import { Address } from 'forms/models/address'
import { ClaimantDetails } from 'forms/models/claimantDetails'
import Claimant from 'drafts/models/claimant'
import { DefendantDetails } from 'forms/models/defendantDetails'
import { Amount } from 'forms/models/amount'
import { HousingDisrepair } from 'forms/models/housingDisrepair'
import { PersonalInjury } from 'forms/models/personalInjury'
import { OrganisationName } from 'forms/models/organisationName'
import Representative from 'drafts/models/representative'
import { Search } from 'forms/models/search'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { WhatDocuments } from 'forms/models/whatDocuments'
import { DocumentType } from 'forms/models/documentType'
import { FileTypes } from 'forms/models/fileTypes'

const serviceBaseURL: string = `${config.get('draft-store.url')}`

const sampleDashboardDraftObj = {
  search: { reference: '000LR001' } as Search
}

const sampleCertificateOfServiceDraftObj = {
  uploadedDocuments: [ {
    fileName: '000LR012.pdf',
    fileType: FileTypes.PDF,
    documentType: {
      value: 'PARTICULARS_OF_CLAIM',
      displayValue: 'Particulars of claim',
      dataStoreValue: 'particularsOfClaim'
    } as DocumentType,
    documentManagementURI: '/documents/85d97996-22a5-40d7-882e-3a382c8ae1b4'
  } as UploadedDocument ],
  whatDocuments: {
    types: ['scheduleOfLoss', 'medicalReport', 'other'],
    otherDocuments: undefined
  } as WhatDocuments,
  fileToUpload: {
    value: 'PARTICULARS_OF_CLAIM',
    displayValue: 'Particulars of claim',
    dataStoreValue: 'particularsOfClaim'
  }
}

const sampleClaimDraftObj = {
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
  readResolveDispute: true,
  readCompletingClaim: true,
  representative: {
    organisationName: { name: 'My Organisation Name' } as OrganisationName,
    address: {
      line1: 'Apt 99',
      line2: 'Building A',
      city: 'London',
      postcode: 'E1'
    } as Address
  } as Representative,
  claimants: [{
    claimantDetails: {
      type: { value: 'INDIVIDUAL' },
      fullName: 'fullName'
    } as ClaimantDetails,
    address: {
      line1: 'Apt 99',
      city: 'London',
      postcode: 'E1'
    }as Address
  } as Claimant],
  defendants: [{
    address: {
      line1: 'Apt 99',
      city: 'London',
      postcode: 'E1'
    } as Address,
    representative: {
      organisationName: 'Defendant Company Name',
      address: {
        line1: 'Apt 99',
        line2: 'Building A',
        city: 'London',
        postcode: 'E1'
      }as Address
    },
    defendantRepresented: {
      isDefendantRepresented: { value: 'YES' },
      companyName: 'Defendant rep'
    },
    defendantDetails: {
      type: { value: 'INDIVIDUAL' },
      fullName: 'fullName'
    } as DefendantDetails
  }],
  amount: {
    cannotState: '',
    lowerValue: 100,
    higherValue: 1000
  } as Amount,
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
  } as HousingDisrepair,
  personalInjury: {
    personalInjury: { value: YesNo.NO.value, displayValue: YesNo.NO.value },
    generalDamages: undefined
  } as PersonalInjury,
  viewFlowOption: true,
  defendantChangeIndex: undefined,
  claimantChangeIndex: undefined
}

export function resolveFind (draftType: string, draftOverride?: object): mock.Scope {
  let documentDocument: object

  switch (draftType) {
    case 'legalClaim':
      documentDocument = { ...sampleClaimDraftObj, ...draftOverride }
      break
    case 'dashboard':
      documentDocument = { ...sampleDashboardDraftObj, ...draftOverride }
      break
    case 'legalCertificateOfService':
      documentDocument = { ...sampleCertificateOfServiceDraftObj, ...draftOverride }
      break
    default:
      throw new Error('Unsupported draft type')
  }

  return mock(serviceBaseURL)
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

export function resolveFindAllDrafts (): mock.Scope {
  return mock(serviceBaseURL)
    .get(new RegExp('/drafts.*'))
    .reply(HttpStatus.OK, {
      data: [{
        id: 100,
        type: 'legalClaim',
        document: sampleClaimDraftObj,
        created: '2017-10-01T12:00:00.000',
        updated: '2017-10-01T12:01:00.000'
      }]
    })
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
