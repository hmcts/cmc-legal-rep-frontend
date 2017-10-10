import { Address } from 'forms/models/address'
import { ContactDetails } from 'forms/models/contactDetails'
import OrganisationName from 'forms/models/organisationName'
import { FeeAccount } from 'forms/models/feeAccount'

export class RepresentativesDetails {
  organisationName: OrganisationName = new OrganisationName()
  address: Address = new Address()
  contactDetails: ContactDetails = new ContactDetails()
  feeAccount: FeeAccount = new FeeAccount()
}
