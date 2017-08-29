import { Serializable } from 'app/models/serializable'
import { Defendant } from 'claims/models/defendant'
import { Amount } from 'claims/models/amount'
import { Party } from 'claims/models/party'
import { StatementOfTruth } from 'forms/models/statementOfTruth'

export default class ClaimData implements Serializable<ClaimData> {

  claimant: Party
  defendants: Defendant[]
  feeAmountInPennies: number
  feeAccountNumber: string
  amount: Amount
  reason: string
  paidFeeAmount: number
  statementOfTruth: StatementOfTruth

  deserialize (input: any): ClaimData {
    if (input) {
      this.claimant = new Party().deserialize(input.claimant)
      this.defendants = input.defendants.map((defendant: any) => new Defendant().deserialize(defendant))
      this.feeAmountInPennies = input.feeAmountInPennies
      this.feeAccountNumber = input.feeAccountNumber
      this.amount = new Amount().deserialize(input.amount)
      this.reason = input.reason
      this.paidFeeAmount = input.feeAmountInPennies / 100
      this.statementOfTruth = new StatementOfTruth().deserialize(input.statementOfTruth)
    }
    return this
  }
}
