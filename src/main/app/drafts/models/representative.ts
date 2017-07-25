import { Serializable } from 'models/serializable'
import { Address } from 'forms/models/address'
import CompanyName from 'forms/models/companyName'
import { ContactDetails } from 'forms/models/contactDetails'

export default class Representative implements Serializable<Representative> {

  companyName?: CompanyName
  address?: Address
  contactDetails?: ContactDetails

  constructor (companyName?: CompanyName, address?: Address, contactDetails?: ContactDetails) {
    this.companyName = companyName
    this.address = address
    this.contactDetails = contactDetails
  }

  deserialize (input: any): Representative {
    if (input) {
      this.address = new Address().deserialize( input.address )
      this.companyName = new CompanyName().deserialize( input.companyName )
      this.contactDetails = new ContactDetails().deserialize( input.contactDetails )
    }
    return this
  }
}
