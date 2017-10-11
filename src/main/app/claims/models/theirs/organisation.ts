import { TheirDetails } from './theirDetails'
import { Address } from 'claims/models/address'
import { PartyTypes } from 'forms/models/partyTypes'

export class Organisation extends TheirDetails {

  constructor (name?: string, address?: Address) {
    super(PartyTypes.ORGANISATION.dataStoreValue, name, address)
  }

  deserialize (input: any): Organisation {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))
      this.type = PartyTypes.ORGANISATION.dataStoreValue
    }
    return this
  }
}
