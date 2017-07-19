import { Serializable } from 'models/serializable'
import Claimant from 'drafts/models/claimant'
import Summary from 'forms/models/summary'
import { HousingDisrepair } from 'app/forms/models/housingDisrepair'
import { PersonalInjury } from 'app/forms/models/personalInjury'

export default class DraftClaim implements Serializable<DraftClaim> {
  claimant: Claimant = new Claimant()
  summary: Summary = new Summary()
  personalInjury: PersonalInjury = new PersonalInjury()
  housingDisrepair: HousingDisrepair = new HousingDisrepair()

  deserialize (input: any): DraftClaim {
    if (input) {
      this.claimant = new Claimant().deserialize(input.claimant)
      this.summary = new Summary().deserialize(input.summary)
      this.personalInjury = new PersonalInjury().deserialize(input.personalInjury)
      this.housingDisrepair = new HousingDisrepair().deserialize(input.housingDisrepair)
    }
    return this
  }
}
