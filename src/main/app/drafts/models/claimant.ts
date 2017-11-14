import { Address } from 'app/forms/models/address'
import { ClaimantName } from 'app/forms/models/claimantName'
import { ClaimantDetails } from 'forms/models/claimantDetails'

export default class Claimant {
  address: Address = new Address()
  claimantName: ClaimantName = new ClaimantName()
  claimantDetails: ClaimantDetails = new ClaimantDetails()

  deserialize (input: any): Claimant {
    if (input) {
      this.address = new Address().deserialize(input.address)
      this.claimantName = new ClaimantName().deserialize(input.claimantName)
      this.claimantDetails = new ClaimantDetails().deserialize(input.claimantDetails)
    }
    return this
  }
}
