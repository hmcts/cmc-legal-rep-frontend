import { Serializable } from 'models/serializable'
import Claimant from 'drafts/models/claimant'
import { YourReference } from 'app/forms/models/yourReference'
import { HousingDisrepair } from 'app/forms/models/housingDisrepair'
import { PersonalInjury } from 'app/forms/models/personalInjury'
import PreferredCourt from 'app/forms/models/preferredCourt'
import Representative from 'drafts/models/representative'
import Defendant from 'app/drafts/models/defendant'
import Summary from 'app/forms/models/summary'
import { StatementOfTruth } from 'app/forms/models/statementOfTruth'

export default class DraftLegalClaim implements Serializable<DraftLegalClaim> {
  claimant: Claimant = new Claimant()
  summary: Summary = new Summary()
  yourReference: YourReference = new YourReference()
  personalInjury: PersonalInjury = new PersonalInjury()
  housingDisrepair: HousingDisrepair = new HousingDisrepair()
  preferredCourt: PreferredCourt = new PreferredCourt()
  representative: Representative = new Representative()
  defendant: Defendant = new Defendant()
  statementOfTruth: StatementOfTruth = new StatementOfTruth()

  deserialize (input: any): DraftLegalClaim {
    if (input) {
      this.claimant = new Claimant().deserialize(input.claimant)
      this.summary = new Summary().deserialize(input.summary)
      this.yourReference = new YourReference().deserialize(input.yourReference)
      this.personalInjury = new PersonalInjury().deserialize(input.personalInjury)
      this.housingDisrepair = new HousingDisrepair().deserialize(input.housingDisrepair)
      this.preferredCourt = new PreferredCourt().deserialize(input.preferredCourt)
      this.representative = new Representative().deserialize(input.representative)
      this.defendant = new Defendant().deserialize(input.defendant)
      this.statementOfTruth = new StatementOfTruth().deserialize(input.statementOfTruth)
    }

    return this
  }
}
