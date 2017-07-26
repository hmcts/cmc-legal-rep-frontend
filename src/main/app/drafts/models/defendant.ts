import { Address } from 'forms/models/address'
import { DefendantDetails } from 'app/forms/models/defendantDetails'

export default class Defendant {
  address?: Address = new Address()
  defendantDetails?: DefendantDetails = new DefendantDetails()

  deserialize (input: any): Defendant {
    if (input) {
      this.address = new Address().deserialize( input.address )
      this.defendantDetails = new DefendantDetails().deserialize(input.defendantDetails)
    }
    return this
  }
}
