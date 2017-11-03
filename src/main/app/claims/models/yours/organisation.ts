import { Party } from './party'
import { Address } from 'claims/models/address'
import { PartyTypes } from 'forms/models/partyTypes'

export class Organisation extends Party {
  companiesHouseNumber?: string

  constructor (name?: string,
               address?: Address,
               companiesHouseNumber?: string) {
    super(PartyTypes.ORGANISATION.dataStoreValue, name, address)
    this.companiesHouseNumber = companiesHouseNumber
  }

  deserialize (input: any): Organisation {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.companiesHouseNumber = input.companiesHouseNumber
      this.type = PartyTypes.ORGANISATION.dataStoreValue
    }
    return this
  }
}
