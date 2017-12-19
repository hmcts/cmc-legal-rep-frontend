import { Address } from 'forms/models/address'
import { ContactDetails } from 'forms/models/contactDetails'
import { OrganisationName } from 'forms/models/organisationName'
import { FeeAccount } from 'forms/models/feeAccount'

export class RepresentativeDetails {
  id: string
  organisationName: OrganisationName
  address: Address
  contactDetails: ContactDetails
  feeAccount: FeeAccount
  cookieName: string

  constructor (id?: string, organisationName?: OrganisationName, address?: Address, contactDetails?: ContactDetails,
               feeAccount?: FeeAccount) {
    this.id = id
    this.organisationName = organisationName
    this.address = address
    this.contactDetails = contactDetails
    this.feeAccount = feeAccount
    this.cookieName = 'legalRepresentativeDetails'
  }

  deserialize (input: any): RepresentativeDetails {
    if (input) {
      this.id = input.id
      this.organisationName = input.organisationName
      this.address = input.address
      this.contactDetails = input.contactDetails
      this.feeAccount = input.feeAccount
      this.cookieName = input.cookieName
    }
    return this
  }
}
