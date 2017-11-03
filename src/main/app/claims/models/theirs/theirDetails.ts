import { Serializable } from 'models/serializable'
import { Address } from 'claims/models/address'
import { Representative } from 'claims/models/representative'

export class TheirDetails implements Serializable<TheirDetails> {
  type: string
  name: string
  address: Address
  representative: Representative

  constructor (type?: string, name?: string, address?: Address, representative?: Representative) {
    this.type = type
    this.name = name
    this.address = address
    this.representative = representative
  }

  deserialize (input: any): TheirDetails {
    if (input) {
      this.type = input.type
      this.name = input.name
      if (input.address) {
        this.address = new Address().deserialize(input.address)
      }
      if (input.representative) {
        this.representative = new Representative().deserialize(input.representative)
      }
    }
    return this
  }
}
