import * as config from 'config'
import { requestNonPromise } from 'app/client/request'
import * as http from 'http'
import StringUtils from 'app/utils/stringUtils'
import User from 'idam/user'

const claimStoreBaseUrl = config.get<string>('claim-store.url')

export default class DocumentsClient {

  constructor (public documentsUrl: string = `${claimStoreBaseUrl}/documents`) {
    this.documentsUrl = documentsUrl
  }

  getSealedClaim (claimExternalId: string, user: User): http.IncomingMessage {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    return requestNonPromise.get({
      uri: `${this.documentsUrl}/legalSealedClaim/${claimExternalId}`,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }
}
