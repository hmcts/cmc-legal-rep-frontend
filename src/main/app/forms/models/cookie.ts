import { RepresentativeDetails } from 'forms/models/representativeDetails'

export class Cookie {
  representativeDetails: RepresentativeDetails[]

  public static getCookie (legalRepresentativeDetails: RepresentativeDetails[], id: string): RepresentativeDetails {
    if (legalRepresentativeDetails === undefined) {
      return new RepresentativeDetails()
    } else {
      const representativeDetail: RepresentativeDetails = legalRepresentativeDetails.find(function (representativeDetail: RepresentativeDetails) {
        return representativeDetail.id === id
      })

      if (representativeDetail === undefined) {
        return new RepresentativeDetails()
      } else {
        return representativeDetail
      }
    }
  }

  public static saveCookie (legalRepresentativeDetails: RepresentativeDetails[], id: string, legalRepDetails: RepresentativeDetails): RepresentativeDetails[] {
    let representativeDetails: RepresentativeDetails[] = legalRepresentativeDetails === undefined ? [] : legalRepresentativeDetails
    representativeDetails = representativeDetails.filter(function (representativeDetail: RepresentativeDetails) {
      return representativeDetail.id !== id
    })

    if (legalRepDetails !== undefined) {
      legalRepDetails.id = id
      representativeDetails.push(legalRepDetails)
    }

    return representativeDetails
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
