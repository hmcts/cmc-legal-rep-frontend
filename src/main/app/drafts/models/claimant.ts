import { Address } from 'forms/models/address'
import { ClaimantDetails } from 'forms/models/claimantDetails'

export default class Claimant {
  address: Address = new Address()
  claimantDetails: ClaimantDetails = new ClaimantDetails()

  deserialize (input: any): Claimant {
    if (input) {
      this.address = new Address().deserialize(input.address)
      this.claimantDetails = new ClaimantDetails().deserialize(input.claimantDetails)
    }
    return this
  }
}
