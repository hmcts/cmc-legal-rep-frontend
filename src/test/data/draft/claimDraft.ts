import { defendants, claimants } from 'test/data/draft/partyDetails'

export const claimDraft = {
  externalId: 'b5503a41-bfb0-4087-a076-f6e66c803674',
  claimants: claimants,
  summary: {
    text: 'bb'
  },
  amount: {
    lowerValue: 23.09,
    higherValue: 25.08
  },
  yourReference: {
    reference: 'Our Ref'
  },
  personalInjury: {
    personalInjury: {
      value: 'NO',
      displayValue: 'no'
    }
  },
  housingDisrepair: {
    housingDisrepair: {
      value: 'NO',
      displayValue: 'no'
    }
  },
  preferredCourt: {
    name: 'My Court'
  },
  representative: {
    organisationName: {
      name: 'test'
    },
    address: {
      line1: 'TEST ADD ORG',
      line2: '',
      city: 'TEST ADD ORG CITY',
      postcode: 'POSTCODE'
    },
    contactDetails: {}
  },
  defendants: defendants,
  statementOfTruth: {
    signerName: 'qa',
    signerRole: 'qa'
  },
  feeAccount: {
    reference: 'PBA0000000'
  },
  feeCode: 'X0001',
  feeAmountInPennies: 3500,
  lastUpdateTimestamp: 1507631932
}
