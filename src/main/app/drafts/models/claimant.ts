import Name from 'app/forms/models/name'
import { Address } from 'app/forms/models/address'
import { ClaimantDetails } from 'app/forms/models/claimantDetails'

export default class Claimant {
  name: Name = new Name()
  address: Address = new Address()
  claimantDetails: ClaimantDetails = new ClaimantDetails()

  deserialize (input: any): Claimant {
    if (input) {
      this.name = new Name().deserialize(input.name)
      this.address = new Address().deserialize(input.address)
      this.claimantDetails = new ClaimantDetails().deserialize(input.claimantDetails)
    }
    return this
  }
}
