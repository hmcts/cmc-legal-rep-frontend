import { OrganisationMinimalInfoResponse } from './organisationMinimalInfoResponse'

export class OrganisationEntityResponse {
  readonly sraId: string
  readonly paymentAccount: Array<string>
  readonly organisationMinimalInfo: OrganisationMinimalInfoResponse
}
