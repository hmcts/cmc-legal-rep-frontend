import Claim from 'claims/models/claim'
import ClaimStoreClient from 'claims/claimStoreClient'

export class SearchClaim {

  static search (query: string, userAuthToken: string): Promise<Claim> {
    if (!query) {
      return Promise.reject(new Error('Search text cannot be blank'))
    }
    if (!userAuthToken) {
      return Promise.reject(new Error('User auth token cannot be blank'))
    }
    const text: string = query.trim()
    if (SearchClaim.isClaimReferenceNumber(text)) {
      return ClaimStoreClient.retrieveByClaimReference(text, userAuthToken)
    } else {
      return ClaimStoreClient.retrieveByExternalReference(text, userAuthToken)
    }
  }

  static isClaimReferenceNumber (text: string): boolean {

    if (text.match(new RegExp(/^\d{3}LR\d{3}$/gi))) {
      return true
    } else {
      return false
    }
  }
}
