import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'
import { ServiceAuthToken } from 'idam/serviceAuthToken'
import * as config from 'config'
import { plainToClass } from 'class-transformer'
import { OrganisationEntityResponse } from './models/organisationEntityResponse'

const refDataURL = config.get<string>('refData.url')

export default class RefDataClient {
  constructor (public serviceAuthToken: ServiceAuthToken) {
    this.serviceAuthToken = serviceAuthToken
  }

  async getAccountsForOrganisation (orgId: string, emailId: string): Promise<OrganisationEntityResponse> {
    const authToken = await new ServiceAuthTokenFactoryImpl().get()

    const response: object = request.get({
        uri: `${refDataURL}/organisations/${orgId}/pbas/${emailId}`,
        headers: {
            ServiceAuthorization: `Bearer ${authToken}`
        }
    }).then(() => Promise.resolve())
        .catch(() => Promise.reject())

    return plainToClass(OrganisationEntityResponse, response)
  }
}
