import { Serializable } from 'app/models/serializable'

export default class DraftView implements Serializable<DraftView> {
  isDefendantDeleted: boolean = false
  isClaimantDeleted: boolean = false
  defendantChangeIndex?: number
  claimantChangeIndex?: number

  deserialize (input: any): DraftView {
    if (input) {
      this.isDefendantDeleted = input.isDefendantDeleted
      this.isClaimantDeleted = input.isClaimantDeleted
      this.defendantChangeIndex = input.defendantChangeIndex
      this.claimantChangeIndex = input.claimantChangeIndex
    }

    return this
  }
}
