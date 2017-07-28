import Name from 'app/forms/models/name'
import { Address } from 'app/forms/models/address'

export default class Claimant {
  name: Name = new Name()
  address: Address = new Address()

  deserialize (input: any): Claimant {
    if (input) {
      this.name = new Name().deserialize(input.name)
      this.address = new Address().deserialize(input.address)
    }
    return this
  }
}
