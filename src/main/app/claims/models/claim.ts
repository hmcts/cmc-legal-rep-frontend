import { Serializable } from 'models/serializable'

import { Moment } from 'moment'
import ClaimData from 'app/claims/models/claimData'
import { MomentFactory } from 'common/momentFactory'
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
      if (input.files) {
        this.files = this.deserializeDocuments(input.files)
      }
    }
    return this
  }

  // noinspection JSUnusedGlobalSymbols Called in the view
  get remainingDays (): number {
    return this.responseDeadline.diff(MomentFactory.currentDate(), 'days')
  }

  private deserializeDocuments (documents: any): UploadedDocument[] {
    if (documents) {
      return documents.map((document: any) => {
        return new UploadedDocument().deserialize(document)
      })
    }
  }
}
