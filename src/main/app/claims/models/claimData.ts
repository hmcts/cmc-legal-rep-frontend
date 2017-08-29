import { Serializable } from 'app/models/serializable'
import Claimant from 'app/drafts/models/claimant'
import Defendant from 'drafts/models/defendant'
import { Amount } from 'claims/models/amount'

export default class ClaimData implements Serializable<ClaimData> {
  claimant: Claimant
  defendants: Defendant[]
  feeAmountInPennies: number
  amount: Amount
  reason: string

  deserialize (input: any): ClaimData {
    if (input) {
      this.claimant = new Claimant().deserialize(input.claimant)

      this.defendants = input.defendants.map((defendant: any) => new Defendant().deserialize(defendant))
      this.reason = input.reason
      this.feeAmountInPennies = input.feeAmountInPennies
      this.amount = new Amount().deserialize(input.amount)
    }
    return this
  }
}
