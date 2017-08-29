import { Serializable } from 'models/serializable'
import { Address } from 'claims/models/address'
import { ContactDetails } from 'claims/models/contactDetails'

export default class Representative implements Serializable<Representative> {

  companyName?: string
  companyAddress?: Address
  companyContactDetails?: ContactDetails
  reference?: string
  preferredCourt?: string

  constructor (companyName?: string, companyAddress?: Address, companyContactDetails?: ContactDetails,
               reference?: string, preferredCourt?: string) {

    this.companyName = companyName
    this.companyAddress = companyAddress
    this.companyContactDetails = companyContactDetails
    this.reference = reference
    this.preferredCourt = preferredCourt
  }

  deserialize (input: any): Representative {
    if (input) {
      this.companyName = input.companyName
      this.companyAddress = new Address().deserialize(input.companyAddress)
      this.companyContactDetails = new ContactDetails().deserialize(input.contactDetails)
      this.reference = input.reference
      this.preferredCourt = this.preferredCourt
    }
    return this
  }
}
