import DraftLegalClaim from 'drafts/models/draftLegalClaim'
import Defendant from 'drafts/models/defendant'

export class ClaimModelConverter {

  static convert (draftClaim: DraftLegalClaim): any {
    this.convertClaimantDetails(draftClaim)
    this.convertDefendantDetails(draftClaim)

    draftClaim['reason'] = draftClaim.summary.text

    return draftClaim
  }

  private static convertClaimantDetails (draftClaim: DraftLegalClaim): void {
    draftClaim.claimant['type'] = draftClaim.claimant.claimantDetails.type.dataStoreValue

    if (draftClaim.amount.canNotState()) {
      draftClaim.amount['type'] = 'cannotState'
    } else {
      draftClaim.amount['type'] = 'range'
    }

    draftClaim.claimant['name'] = draftClaim.claimant.claimantDetails.fullName

  }

  private static convertDefendantDetails (draftClaim: DraftLegalClaim): void {
    draftClaim.defendants.map((defendant: Defendant) => {
      defendant['name'] = defendant.defendantDetails.fullName
      defendant['type'] = defendant.defendantDetails.type.dataStoreValue
      return defendant
    })
  }

}
