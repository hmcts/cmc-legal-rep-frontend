import { Party } from './party'
import { Address } from 'claims/models/address'
import { PartyTypes } from 'forms/models/partyTypes'

export class Individual extends Party {

  constructor (name?: string,
               address?: Address) {
    super(PartyTypes.INDIVIDUAL.dataStoreValue, name, address)
  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.type = PartyTypes.INDIVIDUAL.dataStoreValue
    }
    return this
  }
}
