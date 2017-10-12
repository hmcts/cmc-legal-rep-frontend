import { Address } from 'forms/models/address'
import { ContactDetails } from 'forms/models/contactDetails'
import { OrganisationName } from 'forms/models/organisationName'
import { FeeAccount } from 'forms/models/feeAccount'
import * as express from 'express'
import CookieProperties from 'common/cookieProperties'

export class RepresentativeDetails {
  organisationName: OrganisationName = new OrganisationName()
  address: Address = new Address()
  contactDetails: ContactDetails = new ContactDetails()
  feeAccount: FeeAccount = new FeeAccount()
  cookieName: string = ''

  constructor () {
    this.organisationName = new OrganisationName()
    this.address = new Address()
    this.contactDetails = new ContactDetails()
    this.feeAccount = new FeeAccount()
    this.cookieName = 'legalRepresentativeDetails'
  }

  public static getCookie (req: express.Request): RepresentativeDetails {
    return req.signedCookies.legalRepresentativeDetails === undefined ? new RepresentativeDetails() : req.signedCookies.legalRepresentativeDetails
  }

  public static saveCookie (res: express.Response, legalRepDetails: RepresentativeDetails) {
    res.cookie(legalRepDetails.cookieName, legalRepDetails, CookieProperties.getCookieParameters() )
  }
}
