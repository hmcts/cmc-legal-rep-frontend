import { Address } from 'forms/models/address'
import { ContactDetails } from 'forms/models/contactDetails'
import OrganisationName from 'forms/models/organisationName'
import { FeeAccount } from 'forms/models/feeAccount'
import * as express from 'express'
import CookieProperties from 'common/cookieProperties'

export class RepresentativesDetails {
  organisationName: OrganisationName = new OrganisationName()
  address: Address = new Address()
  contactDetails: ContactDetails = new ContactDetails()
  feeAccount: FeeAccount = new FeeAccount()
  cookieName: string = 'legalRepresentativeDetails'

  constructor () {
    this.organisationName = new OrganisationName()
    this.address = new Address()
    this.contactDetails = new ContactDetails()
    this.feeAccount = new FeeAccount()
    this.cookieName = 'legalRepresentativeDetails'
  }

  public static getCookie (req: express.Request): RepresentativesDetails {
    return req.signedCookies.legalRepresentativeDetails === undefined ? new RepresentativesDetails() : req.signedCookies.legalRepresentativeDetails
  }

  public static saveCookie (res: express.Response, legalRepDetails: RepresentativesDetails) {
    res.cookie(legalRepDetails.cookieName, legalRepDetails, CookieProperties.getCookieParameters() )
  }
}
