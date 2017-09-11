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
import { Amount } from 'app/forms/models/amount'
import { FeeAccount } from 'forms/models/feeAccount'

export default class DraftLegalClaim implements Serializable<DraftLegalClaim> {
  claimants: Claimant[] = [new Claimant()]
  summary: Summary = new Summary()
  amount: Amount = new Amount()
  yourReference?: YourReference = new YourReference()
  personalInjury: PersonalInjury = new PersonalInjury()
  housingDisrepair: HousingDisrepair = new HousingDisrepair()
  preferredCourt?: PreferredCourt = new PreferredCourt()
  representative: Representative = new Representative()
  defendants: Defendant[] = [new Defendant()]
  statementOfTruth: StatementOfTruth = new StatementOfTruth()
  feeAccount: FeeAccount = new FeeAccount()
  feeAmountInPennies: number
  feeCode: string

  deserialize (input: any): DraftLegalClaim {
    if (input) {
      this.summary = new Summary().deserialize(input.summary)
      this.amount = new Amount().deserialize(input.amount)
      if (input.yourReference && input.yourReference.reference) {
        this.yourReference = new YourReference().deserialize(input.yourReference)
      }
      this.personalInjury = new PersonalInjury().deserialize(input.personalInjury)
      this.housingDisrepair = new HousingDisrepair().deserialize(input.housingDisrepair)
      if (input.preferredCourt && input.preferredCourt.name) {
        this.preferredCourt = new PreferredCourt().deserialize(input.preferredCourt)
      }
      this.representative = new Representative().deserialize(input.representative)
      this.statementOfTruth = new StatementOfTruth().deserialize(input.statementOfTruth)
      this.feeAccount = new FeeAccount().deserialize(input.feeAccount)

      if (input.feeAmountInPennies) {
        this.feeAmountInPennies = input.feeAmountInPennies
      }

      if (input.claimants && input.claimants.length > 0) {
        let claimants: Claimant[] = []
        input.claimants.map((claimant) => claimants.push(new Claimant().deserialize(claimant)))
        this.claimants = claimants
      }

      if (input.defendants && input.defendants.length > 0) {
        let defendants: Defendant[] = []
        input.defendants.map((defendant) => defendants.push(new Defendant().deserialize(defendant)))
        this.defendants = defendants
      }
      this.feeCode = input.feeCode
    }

    return this
  }
}
