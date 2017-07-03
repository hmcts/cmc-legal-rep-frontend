import { Serializable } from 'models/serializable'
import Claimant from 'drafts/models/claimant'

export default class DraftClaim implements Serializable<DraftClaim> {
  claimant: Claimant = new Claimant()

  deserialize (input: any): DraftClaim {
    if (input) {
      this.claimant = new Claimant().deserialize(input.claimant)
    }
    return this
  }
}
