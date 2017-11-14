import { PartyTypes } from 'forms/models/partyTypes'

export const claimantName = {
  value: 'no name'
}

export const organisation = {
  type: {
    value: PartyTypes.ORGANISATION.dataStoreValue,
    displayValue: 'An organisation',
    dataStoreValue: 'organisation'
  },
  title: null,
  fullName: null,
  organisation: 'defendant org',
  companyHouseNumber: ''
}

export const claimants = [{
  address: {
    line1: 'Address Line 1',
    line2: '',
    city: 'City',
    postcode: 'NE83BA'
  },
  claimantName: claimantName,
  type: PartyTypes.CLAIMANT.dataStoreValue,
  representative: {
    organisationName: 'test',
    organisationAddress: {
      line1: 'TEST ADD ORG',
      line2: '',
      city: 'TEST ADD ORG CITY',
      postcode: 'POSTCODE'
    },
    organisationContactDetails: {}
  }
}]

export const defendants = [{
  address: {
    line1: 'DEFENDANT ADD 1',
    line2: '',
    city: 'DEFENDANT TOWN',
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
  defendantDetails: organisation,
  name: 'defendant org',
  type: PartyTypes.ORGANISATION.dataStoreValue
}]
