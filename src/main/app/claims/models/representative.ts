import { Serializable } from 'models/serializable'
import { Address } from 'claims/models/address'
import { ContactDetails } from 'claims/models/contactDetails'

export class Representative implements Serializable<Representative> {

  organisationName?: string
  organisationAddress?: Address
  organisationContactDetails?: ContactDetails

  deserialize (input?: any): Representative {
    if (input) {
      this.organisationName = input.organisationName
      if (input.organisationAddress) {
        this.organisationAddress = new Address().deserialize(input.organisationAddress)
      }
      if (input.organisationContactDetails) {
        this.organisationContactDetails = new ContactDetails().deserialize(input.organisationContactDetails)
      }
    }

    return this
  }
}
