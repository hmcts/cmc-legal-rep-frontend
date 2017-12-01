import DraftLegalClaim from 'drafts/models/draftLegalClaim'
import DraftView from 'app/drafts/models/draftView'
import { Draft } from '@hmcts/draft-store-client/dist/draft/draft'
import { DraftDashboard } from 'drafts/models/draftDashboard'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'
import { DraftUploadDocument } from 'drafts/models/draftUploadDocument'

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
  dashboardDraft: Draft<DraftDashboard>
  legalCertificateOfServiceDraft: Draft<DraftCertificateOfService>
  legalUploadDocumentDraft: Draft<DraftUploadDocument>

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
