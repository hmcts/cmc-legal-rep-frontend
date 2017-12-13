import * as express from 'express'
import CookieProperties from 'common/cookieProperties'
import { RepresentativeDetails } from 'forms/models/representativeDetails'
import User from 'idam/user'

export class Cookie {
  representativeDetails: RepresentativeDetails[]

  public static getCookie (req: express.Request, user: User): RepresentativeDetails {
    if (req.signedCookies.legalRepresentativeDetails === undefined) {
      return new RepresentativeDetails()
    } else {
      const representativeDetails: RepresentativeDetails[] = req.signedCookies.legalRepresentativeDetails
      const representativeDetail: RepresentativeDetails = representativeDetails.find(function (representativeDetail: RepresentativeDetails) {
        return representativeDetail.id === user.id
      })

      if (representativeDetail === undefined) {
        return new RepresentativeDetails()
      } else {
        return representativeDetail
      }
    }
  }

  public static saveCookie (req: express.Request, res: express.Response, legalRepDetails: RepresentativeDetails) {
    let representativeDetails: RepresentativeDetails[] = req.signedCookies.legalRepresentativeDetails === undefined ? [] : req.signedCookies.legalRepresentativeDetails
    representativeDetails = representativeDetails.filter(function (representativeDetail: RepresentativeDetails) {
      return representativeDetail.id !== res.locals.user.id
    })
    legalRepDetails.id = res.locals.user.id
    representativeDetails.push(legalRepDetails)
    res.cookie(legalRepDetails.cookieName, representativeDetails, CookieProperties.getCookieParameters())
  }

  deserialize (input: any): Cookie {
    if (input) {
      if (input.files) {
        this.representativeDetails = this.deserializeRepresentativeDetails(input.files)
      }
    }
    return this
  }

  private deserializeRepresentativeDetails (representativeDetails: any): RepresentativeDetails[] {
    return representativeDetails.map((details: any) => {
      return new RepresentativeDetails().deserialize(details)
    })
  }
}
