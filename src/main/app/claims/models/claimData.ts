import { Serializable } from 'app/models/serializable'
import Claimant from 'app/drafts/models/claimant'

export default class ClaimData implements Serializable<ClaimData> {
  claimant: Claimant
  feeAmountInPennies: number
  amount: number
  reason: string

  deserialize (input: any): ClaimData {
    if (input) {
      this.claimant = new Claimant().deserialize(input.claimant)
      this.reason = input.reason
      this.feeAmountInPennies = input.feeAmountInPennies
    }
    return this
  }
}
