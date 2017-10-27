import DraftLegalClaim from 'drafts/models/draftLegalClaim'
import DraftView from 'app/drafts/models/draftView'
import { Draft } from '@hmcts/draft-store-client/dist/draft/draft'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'

export default class User {
  id: string
  email: string
  forename: string
  surname: string
  roles: string[]
  group: string
  bearerToken: string
  viewDraft: Draft<DraftView>
  legalClaimDraft: Draft<DraftLegalClaim>
  legalCertificateOfServiceDraft: Draft<DraftCertificateOfService>

  constructor (id: string,
               email: string,
               forename: string,
               surname: string,
               roles: string[],
               group: string,
               bearerToken: string) {
    this.id = id
    this.email = email
    this.forename = forename
    this.surname = surname
    this.roles = roles
    this.group = group
    this.bearerToken = bearerToken
  }

  isInRoles (...requiredRoles: string[]): boolean {
    return requiredRoles.every(requiredRole => this.roles.indexOf(requiredRole) > -1)
  }

}
