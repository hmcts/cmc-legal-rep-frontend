import { Serializable } from 'models/serializable'
import { Address } from 'claims/models/address'
import Representative from 'claims/models/representative'

export class Party implements Serializable<Party> {
  type: string
  name: string
  address: Address
  correspondenceAddress?: Address
  mobilePhone?: string
  representative?: Representative

  deserialize (input: any): Party {
    if (input) {
      this.type = input.type
      this.name = input.name
      this.address = new Address().deserialize(input.address)
      if (input.correspondenceAddress) {
        this.correspondenceAddress = new Address().deserialize(input.correspondenceAddress)
      }
      if (input.mobilePhone) {
        this.mobilePhone = input.mobilePhone
      }
      if (input.representative) {
        this.representative = new Representative().deserialize(input.representative)
      }
    }
    return this
  }
}
