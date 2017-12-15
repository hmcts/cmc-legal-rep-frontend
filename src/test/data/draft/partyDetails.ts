import { PartyType } from 'app/common/partyType'

export const individualDetails = {
  type: {
    value: PartyType.INDIVIDUAL.value,
    dataStoreValue: 'individual'
  },
  title: 'Mr',
  fullName: 'no name',
  organisation: null,
  companyHouseNumber: null
}

export const organisationDetails = {
  type: {
    value: PartyType.ORGANISATION.value,
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
  claimantDetails: individualDetails
}]

export const defendants = [{
  address: {
    line1: 'DEFENDANT ADD 1',
    line2: '',
    city: 'DEFENDANT TOWN',
    postcode: 'SW1H 9AJ'
  },
  representative: {
    organisationName: {},
    address: {
      line1: 'LEGAL REP ADD1',
      line2: '',
      city: 'LEGAL REP TOWN',
      postcode: 'SW1H 9DJ'
    },
    contactDetails: {}
  },
  defendantDetails: organisationDetails,
  defendantRepresented: {
    isDefendantRepresented: {
      value: 'YES',
      displayValue: 'yes'
    },
    organisationName: 'legal rep'
  },
  serviceAddress: {}
}]
