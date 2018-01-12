import * as config from 'config'
import { request, requestNonPromise } from 'client/request'
import { Request } from 'request'
import StringUtils from 'app/utils/stringUtils'
import * as fs from 'fs'
import * as URL from 'url-parse'

const claimStoreBaseUrl = config.get<string>('claim-store.url')
const documentManagementUrl = config.get<string>('documentManagement.url')

export default class DocumentsClient {

  static getSealedClaim (claimExternalId: string, userAuthToken: string): Request {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    return requestNonPromise.get({
      uri: `${claimStoreBaseUrl}/documents/legalSealedClaim/${claimExternalId}`,
      headers: {
        Authorization: `Bearer ${userAuthToken}`
      }
    })
  }

  static save (userAuthToken: string, file: any): Promise<string> {

    const endpointURL: string = `${documentManagementUrl}/documents`

    return request.post(endpointURL, {
      headers: {
        Authorization: `Bearer ${userAuthToken}`
      },
      formData: {
        files: [
          {
            value: fs.createReadStream(file.path),
            options: { filename: file.name, contentType: file.type }
          }
        ],
        classification: 'RESTRICTED'
      }
    })
      .then((response: any) => {
        const href: string = response._embedded.documents[0]._links.self.href
        return new URL(href).pathname
      })
  }

  static getBinaryUrl (userAuthToken: string, path: string): Promise<string> {

    const endpointURL: string = `${documentManagementUrl}${path}`

    return request.get(endpointURL, {
      headers: {
        Authorization: `Bearer ${userAuthToken}`
      }
    })
      .then((response: any) => {
        const href: string = response._links.binary.href
        return new URL(href).pathname
      })
  }

  static getDocument (userAuthToken: string, path: string): Request {
    const endpointURL: string = `${documentManagementUrl}${path}`

    return requestNonPromise.get(endpointURL, {
      headers: {
        Authorization: `Bearer ${userAuthToken}`
      }
    })
  }
}
