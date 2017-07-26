import { Address } from 'forms/models/address'
import Representative from 'drafts/models/representative'
import { DefendantDetails } from 'app/forms/models/defendantDetails'

export default class Defendant {
  address?: Address = new Address()
  representative: Representative = new Representative()
  defendantDetails?: DefendantDetails = new DefendantDetails()

  deserialize (input: any): Defendant {
    if (input) {
      this.address = new Address().deserialize( input.address )
      this.representative = new Representative().deserialize( input.representative )
      this.defendantDetails = new DefendantDetails().deserialize(input.defendantDetails)
    }
    return this
  }
}
