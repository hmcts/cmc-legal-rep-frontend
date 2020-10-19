import { Serializable } from 'models/serializable'

export class OrganisationMinimalInfoResponse implements Serializable <OrganisationMinimalInfoResponse> {
  deserialize (obj: any): OrganisationMinimalInfoResponse {
    throw new Error('Method not implemented.')
  }
  readonly name: string
  readonly organisationIdentifier: string
}
