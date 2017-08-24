import { Serializable } from 'models/serializable'
import { Address } from 'forms/models/address'
import CompanyName from 'forms/models/organisationName'
import { ContactDetails } from 'forms/models/contactDetails'

export default class Representative implements Serializable<Representative> {

  organisationName?: CompanyName
  address?: Address
  contactDetails?: ContactDetails

  constructor (organisationName?: CompanyName, address?: Address, contactDetails?: ContactDetails) {
    this.organisationName = organisationName
    this.address = address
    this.contactDetails = contactDetails
  }

  deserialize (input: any): Representative {
    if (input) {
      this.address = new Address().deserialize( input.address )
      this.organisationName = new CompanyName().deserialize( input.organisationName )
      this.contactDetails = new ContactDetails().deserialize( input.contactDetails )
    }
    return this
  }
}
