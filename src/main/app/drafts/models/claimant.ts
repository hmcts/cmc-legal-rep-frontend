import { ClaimantType } from 'forms/models/claimantType'

export default class Claimant {
  claimantType: ClaimantType = new ClaimantType()

  deserialize (input: any): Claimant {
    if (input) {
      this.claimantType = new ClaimantType().deserialize(input.claimantType)
    }
    return this
  }
}
