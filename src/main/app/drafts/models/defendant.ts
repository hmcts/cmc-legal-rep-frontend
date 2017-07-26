import { Address } from 'forms/models/address'
import { DefendantDetails } from 'app/forms/models/defendantDetails'

export default class Defendant {
  address?: Address = new Address()
  personalDetails?: DefendantDetails = new DefendantDetails()

  deserialize (input: any): Defendant {
    if (input) {
      this.address = new Address().deserialize( input.address )
      this.personalDetails = new DefendantDetails().deserialize(input.personalDetails)
    }
    return this
  }
}
