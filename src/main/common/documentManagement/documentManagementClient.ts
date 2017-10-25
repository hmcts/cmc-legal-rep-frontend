import request from 'client/request'
import * as config from 'config'
import Claim from 'app/claims/models/claim'
import User from 'app/idam/user'
import { ClaimModelConverter } from 'claims/claimModelConverter'

const documentManageApiBaseUrl = `${config.get<string>('documentManagement.url')}`
const documentManagementApiUrl = `${documentManageApiBaseUrl}/documents`

export default class DocumentManagementClient {
  static saveDocumentForUser (user: User): Promise<Claim> {
    const convertedDraftClaim: object = ClaimModelConverter.convert(user.legalClaimDraft)

    return request.post(`${documentManagementApiUrl}`, {
      body: convertedDraftClaim,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }
}
