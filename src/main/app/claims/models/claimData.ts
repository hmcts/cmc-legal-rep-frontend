import { Serializable } from 'app/models/serializable'

export default class ClaimData implements Serializable<ClaimData> {

  feeAmountInPennies: number

  deserialize (input: any): ClaimData {
    if (input) {
      this.feeAmountInPennies = input.feeAmountInPennies
    }
    return this
  }
}
