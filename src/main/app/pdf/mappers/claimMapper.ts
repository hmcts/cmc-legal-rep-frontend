import { MomentFormatter } from 'utils/momentFormatter'
import { NumberFormatter } from 'utils/numberFormatter'
import Claim from 'claims/models/claim'

export class ClaimMapper {

  static createClaimDetails (claim: Claim): object {
    const data = {
      submittedDate: MomentFormatter.formatLongDateAndTime(claim.createdAt),
      issuedOn: MomentFormatter.formatLongDateAndTime(claim.issuedOn),
      claimNumber: claim.claimNumber,
      issueFee: NumberFormatter.formatMoney(claim.claimData.paidFeeAmount)
    }
    return data
  }
}
