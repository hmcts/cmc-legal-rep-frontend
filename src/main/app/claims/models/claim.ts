import { Serializable } from 'models/serializable'

import { Moment } from 'moment'
import { toMoment } from 'app/utils/momentUtils'
import ClaimData from 'app/claims/models/claimData'
import * as moment from 'moment'

export default class Claim implements Serializable<Claim> {
  id: number
  externalId: string
  defendantId: number
  claimNumber: string
  responseDeadline: Moment
  createdAt: Moment
  issuedOn: Moment
  claimData: ClaimData
  moreTimeRequested: boolean

  deserialize (input: any): Claim {
    if (input) {
      this.id = input.id
      this.externalId = input.externalId
      this.defendantId = input.defendantId
      this.claimNumber = input.referenceNumber
      this.createdAt = moment(input.createdAt)
      this.responseDeadline = toMoment(input.responseDeadline)
      this.issuedOn = toMoment(input.issuedOn)
      this.claimData = new ClaimData().deserialize(input.claim)
      this.moreTimeRequested = input.moreTimeRequested
    }
    return this
  }
}
