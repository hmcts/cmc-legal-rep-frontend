import { Serializable } from 'models/serializable'
import Claimant from 'drafts/models/claimant'
import Summary from 'forms/models/summary'

export default class DraftClaim implements Serializable<DraftClaim> {
  claimant: Claimant = new Claimant()
  summary: Summary = new Summary()

  deserialize (input: any): DraftClaim {
    if (input) {
      this.claimant = new Claimant().deserialize(input.claimant)
      this.summary = new Summary().deserialize(input.summary)
    }
    return this
  }
}
