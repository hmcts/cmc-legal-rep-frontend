import { PartyType } from '../../../main/app/common/partyType'

export const individual = {
  type: {
    value: PartyType.INDIVIDUAL.dataStoreValue,
    dataStoreValue: 'individual'
  },
  fullName: 'no name',
  organisation: null,
  companyHouseNumber: null
}

export const organisation = {
  type: {
    value: PartyType.ORGANISATION.dataStoreValue,
    dataStoreValue: 'organisation'
  },
  title: undefined,
  fullName: undefined,
  soleTraderName: undefined,
  businessName: undefined,
  organisation: 'defendant org',
  companyHouseNumber: ''
}

export const soleTrader = {
  type: {
    value: PartyType.SOLE_TRADER.dataStoreValue,
    dataStoreValue: 'soleTrader'
  },
  title: undefined,
  fullName: undefined,
  soleTraderName: 'Sole Trader',
  businessName: 'Traders',
  organisation: undefined,
  companyHouseNumber: undefined
}

export const claimants = [{
  address: {
    line1: 'Address Line 1',
    line2: '',
    city: 'City',
    postcode: 'NE83BA'
  },
  claimantDetails: individual,
  type: PartyType.INDIVIDUAL.dataStoreValue,
  title: 'Mr',
  name: 'no name',
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
  type: PartyType.ORGANISATION.dataStoreValue
}]
