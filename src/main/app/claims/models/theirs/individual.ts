import { TheirDetails } from './theirDetails'
import { Address } from 'claims/models/address'
import { PartyType } from 'common/partyType'

export class Individual extends TheirDetails {

  constructor (name?: string, address?: Address) {
    super(PartyType.INDIVIDUAL.dataStoreValue, name, address)
  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))

      this.type = PartyType.INDIVIDUAL.dataStoreValue
    }
    return this
  }
}
