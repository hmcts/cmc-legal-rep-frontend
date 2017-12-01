import { Serializable } from 'models/serializable'
import { Address } from 'claims/models/address'
import { Representative } from 'claims/models/representative'
import { ClaimantName } from 'forms/models/claimantName'

export class Claimant implements Serializable<Claimant> {
  name: ClaimantName
  address: Address
  representative: Representative

  constructor (name?: ClaimantName,
               address?: Address,
               representative?: Representative) {
    this.name = name
    this.address = address
    this.representative = representative
  }

  deserialize (input: any): Claimant {
    if (input) {
      if (input.name) {
        this.name = new ClaimantName().deserialize(input.name)
      }
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
