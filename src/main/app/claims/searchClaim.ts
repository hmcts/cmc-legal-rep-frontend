import Claim from 'claims/models/claim'
import ClaimStoreClient from 'claims/claimStoreClient'

export class SearchClaim {

  static search (query: string, userAuthToken: string): Promise<Claim> {
    if (!query) {
      return Promise.reject(new Error('search text is missing!'))
    }
    if (SearchClaim.isClaimReferenceNumber(query.trim())) {
      return ClaimStoreClient.retrieveByClaimReference(query.trim(), userAuthToken)
    } else {
      return ClaimStoreClient.retrieveByExternalReference(query.trim(), userAuthToken)
    }
  }

  static isClaimReferenceNumber (text: string): boolean {

    if (text.match(new RegExp(/^\\d{3}LR\\d{3}$/gi))) {
      return true
    } else {
      return false
    }
  }
}
