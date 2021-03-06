import { Serializable } from 'models/serializable'
import Claimant from 'drafts/models/claimant'
import { YourReference } from 'forms/models/yourReference'
import { HousingDisrepair } from 'forms/models/housingDisrepair'
import { PersonalInjury } from 'forms/models/personalInjury'
import PreferredCourt from 'forms/models/preferredCourt'
import Representative from 'drafts/models/representative'
import Defendant from 'drafts/models/defendant'
import Summary from 'forms/models/summary'
import * as uuid from 'uuid'
import { StatementOfTruth } from 'forms/models/statementOfTruth'
import { Amount } from 'forms/models/amount'
import { FeeAccount } from 'forms/models/feeAccount'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { PaymentResponse } from 'pay/model/paymentResponse'

export class DraftLegalClaim extends DraftDocument implements Serializable<DraftLegalClaim> {
  externalId = uuid()
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
  paymentResponse: PaymentResponse
  // View Draft items
  isDefendantDeleted: boolean = false
  isClaimantDeleted: boolean = false
  defendantChangeIndex?: number
  claimantChangeIndex?: number
  ccdCaseId?: number

  deserialize (input: any): DraftLegalClaim {
    if (input) {
      this.externalId = input.externalId
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
      this.isDefendantDeleted = input.isDefendantDeleted
      this.isClaimantDeleted = input.isClaimantDeleted
      this.defendantChangeIndex = input.defendantChangeIndex
      this.claimantChangeIndex = input.claimantChangeIndex
      this.paymentResponse = input.paymentResponse

      if (input.ccdCaseId) {
        this.ccdCaseId = input.ccdCaseId
      }
    }

    return this
  }
}
