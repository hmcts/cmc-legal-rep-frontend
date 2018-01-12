import { Serializable } from 'models/serializable'
import { Address } from 'claims/models/address'
import { Representative } from 'claims/models/representative'
import { HowDidYouServe } from 'forms/models/howDidYouServe'

export class TheirDetails implements Serializable<TheirDetails> {
  type: string
  name: string
  address: Address
  representative: Representative
  howWereYouServed: HowDidYouServe = new HowDidYouServe()

  constructor (type?: string, name?: string, address?: Address, representative?: Representative, howWereYouServed?: HowDidYouServe) {
    this.type = type
    this.name = name
    this.address = address
    this.representative = representative
    this.howWereYouServed = howWereYouServed
  }

  deserialize (input: any): TheirDetails {
    if (input) {
      this.type = input.type
      this.name = input.name
      if (input.address) {
        this.address = new Address().deserialize(input.address)
      }
      if (input.representative) {
        this.representative = new Representative().deserialize(input.representative)
      }
      if (input.howWereYouServed) {
        this.howWereYouServed = new HowDidYouServe().deserialize(input.howWereYouServed)
      }
    }
    return this
  }
}
