import { Serializable } from 'app/models/serializable'
import { Party } from 'claims/models/yours/party'
import { TheirDetails } from 'claims/models/theirs/theirDetails'
import { StatementOfTruth } from 'claims/models/statementOfTruth'
import { PartyTypes } from 'forms/models/partyTypes'
import { Organisation as ClaimantAsOrganisation } from 'claims/models/yours/organisation'
import { Individual as ClaimantAsIndividual } from 'claims/models/yours/individual'
import { Individual as DefendantAsIndividual } from 'claims/models/theirs/individual'
import { Organisation as DefendantAsOrganisation } from 'claims/models/theirs/organisation'
import { Amount } from 'claims/models/amount'

export default class ClaimData implements Serializable<ClaimData> {

  externalId: string
  claimants: Party[]
  defendants: TheirDetails[]
  feeAmountInPennies: number
  reason: string
  statementOfTruth?: StatementOfTruth
  feeAccountNumber: string
  feeCode: string
  preferredCourt?: string
  amount: Amount
  externalReferenceNumber?: string

  deserialize (input: any): ClaimData {
    if (input) {
      this.claimants = this.deserializeClaimants(input.claimants)
      this.defendants = this.deserializeDefendants(input.defendants)
      this.feeAmountInPennies = input.feeAmountInPennies
      this.reason = input.reason
      this.externalId = input.externalId
      if (input.statementOfTruth) {
        this.statementOfTruth = new StatementOfTruth().deserialize(input.statementOfTruth)
      }
      this.feeAccountNumber = input.feeAccountNumber
      this.feeCode = input.feeCode
      this.preferredCourt = input.preferredCourt
      this.externalReferenceNumber = input.externalReferenceNumber
      if (input.amount) {
        this.amount = new Amount().deserialize(input.amount)
      }

    }
    return this
  }

  private deserializeClaimants (claimants: any): Party[] {
    if (claimants) {
      return claimants.map((claimant: any) => {
        switch (claimant.type) {
          case PartyTypes.INDIVIDUAL.dataStoreValue:
            return new ClaimantAsIndividual().deserialize(claimant)
          case PartyTypes.ORGANISATION.dataStoreValue:
            return new ClaimantAsOrganisation().deserialize(claimant)
          default:
            throw Error('Something went wrong, No claimant type is set')
        }
      })
    }
  }

  private deserializeDefendants (defendants: any[]): TheirDetails[] {
    if (defendants) {
      return defendants.map((defendant: any) => {
        switch (defendant.type) {
          case PartyTypes.INDIVIDUAL.dataStoreValue:
            return new DefendantAsIndividual().deserialize(defendant)
          case PartyTypes.ORGANISATION.dataStoreValue:
            return new DefendantAsOrganisation().deserialize(defendant)
          default:
            throw Error('Something went wrong, No defendant type is set')
        }
      })
    }
  }

  get primaryClaimant (): Party {
    return this.claimants[0]
  }

  get primaryDefendant (): Party {
    return this.defendants[0]
  }
}
