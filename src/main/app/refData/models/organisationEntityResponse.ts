import { Serializable } from 'models/serializable'
import { OrganisationMinimalInfoResponse } from './organisationMinimalInfoResponse'

export class OrganisationEntityResponse implements Serializable <OrganisationEntityResponse> {
  deserialize (obj: any): OrganisationEntityResponse {
    throw new Error('Method not implemented.')
  }
  readonly sraId: string
  readonly paymentAccount: Array<string>
  readonly organisationMinimalInfo: OrganisationMinimalInfoResponse
}
