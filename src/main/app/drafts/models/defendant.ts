import { Address } from 'forms/models/address'

export default class Defendant {
  address?: Address = new Address()

  deserialize (input: any): Defendant {
    if (input) {
      this.address = new Address().deserialize( input.address )
    }
    return this
  }
}
