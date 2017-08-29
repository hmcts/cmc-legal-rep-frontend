import { Serializable } from 'app/models/serializable'

export class ContactDetails implements Serializable<ContactDetails> {

  phone?: string
  email?: string
  dxAddress?: string

  constructor (phone?: string, email?: string, dxAddress?: string) {
    this.phone = phone
    this.email = email
    this.dxAddress = dxAddress
  }

  deserialize (input?: any): ContactDetails {
    if (input) {
      this.phone = input.phone
      this.email = input.email
      this.dxAddress = input.dxAddress
    }
    return this
  }

}
