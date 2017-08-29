import { MomentFormatter } from 'utils/momentFormatter'
import { NumberFormatter } from 'utils/numberFormatter'
import Claim from 'claims/models/claim'

export class ClaimMapper {

  static createClaimDetails (claim: Claim): object {
    const data = {
      claimNumber: claim.claimNumber,
      feeAccountNumber: claim.claimData.feeAccountNumber,
      submittedDate: MomentFormatter.formatLongDateAndTime(claim.createdAt),
      issuedOn: MomentFormatter.formatLongDateAndTime(claim.issuedOn),
      claimant: claim.claimData.claimant,

      issueFee: NumberFormatter.formatMoney(claim.claimData.feeAmountInPennies / 100),
      defendants: claim.claimData.defendants
    }
    return data
  }

}
