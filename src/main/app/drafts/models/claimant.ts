import { Address } from 'app/forms/models/address'
import { ClaimantName } from 'app/forms/models/claimantName'

export default class Claimant {
  address: Address = new Address()
  claimantName: ClaimantName = new ClaimantName()

  deserialize (input: any): Claimant {
    if (input) {
      this.address = new Address().deserialize(input.address)
      this.claimantName = new ClaimantName().deserialize(input.claimantName)
    }
    return this
  }
}
