import { Serializable } from 'models/serializable'

import { Moment } from 'moment'
import ClaimData from 'claims/models/claimData'
import { MomentFactory } from 'shared/momentFactory'
import { UploadedDocument } from 'claims/models/uploadedDocument'

export default class Claim implements Serializable<Claim> {
  id: number
  submitterId: string
  externalId: string
  claimNumber: string
  responseDeadline: Moment
  createdAt: Moment
  issuedOn: Moment
  claimData: ClaimData
  submitterEmail: string
  files: UploadedDocument[]
  sealedClaimDocumentSelfPath: string = undefined
  ccdCaseId: number

  deserialize (input: any): Claim {
    if (input) {
      this.id = input.id
      this.submitterId = input.submitterId
      this.externalId = input.externalId
      this.claimNumber = input.referenceNumber
      this.createdAt = MomentFactory.parse(input.createdAt)
      this.responseDeadline = MomentFactory.parse(input.responseDeadline)
      this.issuedOn = MomentFactory.parse(input.issuedOn)
      this.claimData = new ClaimData().deserialize(input.claim)
      this.submitterEmail = input.submitterEmail
      this.sealedClaimDocumentSelfPath = input.sealedClaimDocumentSelfPath
      if (input.files) {
        this.files = this.deserializeDocuments(input.files)
      }
      if (input.ccdCaseId) {
        this.ccdCaseId = input.ccdCaseId
      }
    }
    return this
  }

  // noinspection JSUnusedGlobalSymbols Called in the view
  get remainingDays (): number {
    return this.responseDeadline.diff(MomentFactory.currentDate(), 'days')
  }

  private deserializeDocuments (documents: any): UploadedDocument[] {
    return documents.map((document: any) => {
      return new UploadedDocument().deserialize(document)
    })
  }
}
