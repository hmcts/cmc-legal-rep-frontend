import { Serializable } from 'models/serializable'
import Claimant from 'drafts/models/claimant'
import Summary from 'forms/models/summary'
import { YourReference } from 'app/forms/models/yourReference'

export default class DraftClaim implements Serializable<DraftClaim> {
  claimant: Claimant = new Claimant()
  summary: Summary = new Summary()
  yourReference: YourReference = new YourReference()

  deserialize (input: any): DraftClaim {
    if (input) {
      this.claimant = new Claimant().deserialize(input.claimant)
      this.summary = new Summary().deserialize(input.summary)
      this.yourReference = new YourReference().deserialize(input.yourReference)
    }
    return this
  }
}
