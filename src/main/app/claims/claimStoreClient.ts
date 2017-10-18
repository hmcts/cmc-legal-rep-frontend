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
    const convertedDraftClaim: object = ClaimModelConverter.convert(user.legalClaimDraft)

    return request.post(`${claimStoreApiUrl}/${user.id}`, {
      body: convertedDraftClaim,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static retrieveByClaimantId (claimantId: number): Promise<Claim[]> {
    if (!claimantId) {
      return Promise.reject(new Error('Claimant ID is required'))
    }

    return request
      .get(`${claimStoreApiUrl}/claimant/${claimantId}`)
      .then((claims: object[]) => {
        return claims.map((claim: object) => new Claim().deserialize(claim))
      })
  }

  static retrieveByExternalId (externalId: string, userId: number): Promise<Claim> {
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

  static retrieveByExternalReference (externalReference: string, userAuthToken: string): Promise<Claim[]> {
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
        return claims.map((claim: object) => new Claim().deserialize(claim))
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
      .then((claims: object[]) => {
        return claims.map((claim: object) => new Claim().deserialize(claim))
      })
  }
}
