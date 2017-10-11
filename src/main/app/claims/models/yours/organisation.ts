import { Party } from './party'
import { Address } from 'claims/models/address'
import { PartyTypes } from 'forms/models/partyTypes'

export class Organisation extends Party {
  contactPerson?: string

  constructor (name?: string,
               address?: Address,
               contactPerson?: string) {
    super(PartyTypes.ORGANISATION.dataStoreValue, name, address)
    this.contactPerson = contactPerson
  }

  deserialize (input: any): Organisation {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.contactPerson = input.contactPerson
      this.type = PartyTypes.ORGANISATION.dataStoreValue
    }
    return this
  }
}
