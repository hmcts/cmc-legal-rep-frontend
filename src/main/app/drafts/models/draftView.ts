import { Serializable } from 'app/models/serializable'

export default class DraftView implements Serializable<DraftView> {
  isDefendantDeleted: boolean = false
  isClaimantDeleted: boolean = false

  deserialize (input: any): DraftView {
    if (input) {
      this.isDefendantDeleted = input.isDefendantDeleted
      this.isClaimantDeleted = input.isClaimantDeleted
    }

    return this
  }
}
