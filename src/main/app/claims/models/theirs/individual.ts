import { TheirDetails } from './theirDetails'
import { Address } from 'claims/models/address'
import { PartyTypes } from 'forms/models/partyTypes'

export class Individual extends TheirDetails {

  constructor (name?: string, address?: Address) {
    super(PartyTypes.INDIVIDUAL.value, name, address)
  }

  deserialize (input: any): Individual {
    if (input) {
      Object.assign(this, new TheirDetails().deserialize(input))

      this.type = PartyTypes.INDIVIDUAL.value
    }
    return this
  }
}
