import { Address } from 'forms/models/address'
import Representative from 'drafts/models/representative'

export default class Defendant {
  address?: Address = new Address()
  representative: Representative = new Representative()

  deserialize (input: any): Defendant {
    if (input) {
      this.address = new Address().deserialize( input.address )
      this.representative = new Representative().deserialize( input.representative )
    }
    return this
  }
}
