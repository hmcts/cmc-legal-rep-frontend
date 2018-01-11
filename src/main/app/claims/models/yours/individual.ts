import { Party } from './party'
import { Address } from 'claims/models/address'
import { PartyType } from 'app/common/partyType'

export class Individual extends Party {
  title?: string

  constructor (name?: string, address?: Address, title?: string) {
    super(PartyType.INDIVIDUAL.dataStoreValue, name, address)
    this.title = title
  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.type = PartyType.INDIVIDUAL.dataStoreValue
      this.title = input.title
    }
    return this
  }
}
