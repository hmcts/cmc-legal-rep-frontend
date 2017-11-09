import request from 'client/request'
import * as config from 'config'
import Claim from 'app/claims/models/claim'
import User from 'app/idam/user'
import { ClaimModelConverter } from 'claims/claimModelConverter'
import { ForbiddenError } from '../../errors'

const claimApiBaseUrl = `${config.get<string>('claim-store.url')}`
const claimStoreApiUrl = `${claimApiBaseUrl}/claims`

export default class ClaimStoreClient {
  static saveClaimForUser (user: User): Promise<Claim> {
    const convertedDraftClaim: object = ClaimModelConverter.convert(user.legalClaimDraft.document)
    console.log(`Bearer ${user.bearerToken}`)
    return request.post(`${claimStoreApiUrl}/${user.id}`, {
      body: convertedDraftClaim,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static retrieveByExternalId (externalId: string, userId: string): Promise<Claim> {
    if (!externalId) {
      return Promise.reject(new Error('External id must be set'))
    }

    return request
      .get(`${claimStoreApiUrl}/${externalId}`)
      .then(claim => {
        if (claim) {
          if (userId !== claim.submitterId) {
            throw new ForbiddenError()
          }

          return new Claim().deserialize(claim)
        } else {
          throw new Error('Call was successful, but received an empty claim instance')
        }
      })
  }

  static retrieveByExternalReference (externalReference: string, userAuthToken: string): Promise<Claim> {
    if (!externalReference) {
      return Promise.reject(new Error('Claim external reference is required'))
    }

    return request
      .get(`${claimStoreApiUrl}/representative/${externalReference}`, {
        headers: {
          Authorization: `Bearer ${userAuthToken}`
        }
      })
      .then((claims: object[]) => {
        if (claims.length === 0) {
          return Promise.reject(new Error('No claim found for external reference ' + externalReference))
        } else if (claims.length > 1) {
          return Promise.reject(new Error('More than one claims found for external reference ' + externalReference))
        } else {
          return new Claim().deserialize(claims[0])
        }
      })
  }

  static retrieveByClaimReference (claimReference: string, userAuthToken: string): Promise<Claim> {
    if (!claimReference) {
      return Promise.reject(new Error('Claim reference is required'))
    }

    return request
      .get(`${claimStoreApiUrl}/${claimReference}`, {
        headers: {
          Authorization: `Bearer ${userAuthToken}`
        }
      })
      .then((claim) => {
        return new Claim().deserialize(claim)
      })
  }
}
