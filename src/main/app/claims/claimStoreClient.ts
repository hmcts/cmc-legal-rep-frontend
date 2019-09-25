import { request } from 'client/request'
import * as config from 'config'
import Claim from 'claims/models/claim'
import { User } from 'idam/user'
import { ClaimModelConverter } from 'claims/claimModelConverter'
import { ForbiddenError } from '../../errors'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'
import * as toBoolean from 'to-boolean'

const claimApiBaseUrl = `${config.get<string>('claim-store.url')}`
const claimStoreApiUrl = `${claimApiBaseUrl}/claims`

export default class ClaimStoreClient {
  static saveClaimForUser (user: User, draft: Draft<DraftLegalClaim>): Promise<Claim> {
    const convertedDraftClaim: object = ClaimModelConverter.convert(draft.document)

    return request.post(this.getUri(user), {
      body: convertedDraftClaim,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static getUri (user: User) {
    if (toBoolean(config.get('featureToggles.inversionOfControl'))) {
      return `${claimStoreApiUrl}/${user.id}/create-legal-rep-claim`
    } else {
      return `${claimStoreApiUrl}/${user.id}`
    }
  }

  static retrieveByExternalId (externalId: string, user: User): Promise<Claim> {
    if (!externalId || !user) {
      return Promise.reject(new Error('External id must be set and user must be set'))
    }

    return request
      .get(`${claimStoreApiUrl}/${externalId}`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
      .then(claim => {
        if (claim) {
          if (user.id !== claim.submitterId) {
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
          return Promise.reject(new Error('No claim found for external reference ' + externalReference)) as Promise<Claim>
        } else if (claims.length > 1) {
          return Promise.reject(new Error('More than one claims found for external reference ' + externalReference)) as Promise<Claim>
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

  static retrievePaymentReference (externalId: string, user: User): Promise<string> {
    if (!externalId) {
      throw new Error('External ID is required')
    }

    if (!user || !user.bearerToken) {
      throw new Error('User is required')
    }

    return request
      .post(`${claimStoreApiUrl}/${externalId}/pre-payment`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
      .then((caseReference: any) => caseReference.case_reference)
  }

  static getBySubmitterId (user: User): Promise<Claim[]> {
    if (!user) {
      return Promise.reject(new Error('User is required'))
    }

    return request
      .get(`${claimStoreApiUrl}/claimant/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      })
      .then((claims: object[]) => {
        return claims.map((claim: object) => new Claim().deserialize(claim))
      })
  }
}
