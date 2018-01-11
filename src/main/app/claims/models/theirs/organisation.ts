import { TheirDetails } from './theirDetails'
import { Address } from 'claims/models/address'
import { PartyType } from 'app/common/partyType'

export class Organisation extends TheirDetails {

  constructor (name?: string, address?: Address) {
    super(PartyType.ORGANISATION.dataStoreValue, name, address)
  }

  deserialize (input: any): Organisation {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))
      this.type = PartyType.ORGANISATION.dataStoreValue
    }
    return this
  }
}
