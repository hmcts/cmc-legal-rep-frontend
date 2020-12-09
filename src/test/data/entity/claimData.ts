import { claimants, defendants } from 'test/data/entity/party'

export const claimData = {
  externalId: 'b5503a41-bfb0-4087-a076-f6e66c803674',
  claimants: claimants,
  amount: {
    lowerValue: 23.09,
    higherValue: 25.08,
    type: 'range'
  },
  defendants: defendants,
  statementOfTruth: {
    signerName: 'qa',
    signerRole: 'qa'
  },
  feeCode: 'X0001',
  feeAccountNumber: 'PBA0000000',
  feeAmountInPennies: 3500,
  lastUpdateTimestamp: 1507631932,
  reason: 'bb',
  preferredCourt: 'My Court',
  externalReferenceNumber: 'Our Ref'
}
