import { Serializable } from 'models/serializable'

export class ContactDetails implements Serializable<ContactDetails> {
  phoneNumber?: string
  email?: string
  dxAddress?: string

  constructor (phoneNumber?: string, email?: string, dxAddress?: string) {
    this.phoneNumber = phoneNumber
    this.email = email
    this.dxAddress = dxAddress
  }

  deserialize (input?: any): ContactDetails {
    if (input) {
      if (input.phoneNumber) {
        this.phoneNumber = input.phoneNumber
      }
      if (input.email) {
        this.email = input.email
      }
      if (input.dxAddress) {
        this.dxAddress = input.dxAddress
      }
    }

    return this
  }
}
