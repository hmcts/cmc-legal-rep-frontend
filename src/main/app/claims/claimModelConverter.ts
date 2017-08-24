import DraftLegalClaim from 'drafts/models/draftLegalClaim'
import Defendant from 'drafts/models/defendant'
import { OtherDamages } from 'forms/models/otherDamages'

export class ClaimModelConverter {

  static convert (draftClaim: DraftLegalClaim): object {
    this.convertClaimantDetails(draftClaim)
    this.convertDefendantDetails(draftClaim)

    draftClaim['reason'] = draftClaim.summary.text

    draftClaim.personalInjury.generalDamages = draftClaim.personalInjury.generalDamages.dataStoreValue as any
    delete draftClaim.personalInjury.personalInjury

    console.log(draftClaim.housingDisrepair)
    draftClaim.housingDisrepair['costOfRepairsDamages'] = draftClaim.housingDisrepair.generalDamages.dataStoreValue
    console.log(draftClaim.housingDisrepair['costOfRepairsDamages'])
    delete draftClaim.housingDisrepair.generalDamages

    draftClaim.housingDisrepair.otherDamages = draftClaim.housingDisrepair.otherDamages.dataStoreValue as any
    if (draftClaim.housingDisrepair.otherDamages as any === OtherDamages.NONE.dataStoreValue) {
      delete draftClaim.housingDisrepair.otherDamages
    }
    delete draftClaim.housingDisrepair.housingDisrepair

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

    draftClaim.claimant['representative'] = draftClaim.representative
    draftClaim.claimant['representative'].companyName = draftClaim.representative.companyName.name
    draftClaim.claimant['representative'].companyAddress = draftClaim.representative.address
    draftClaim.claimant['representative'].companyContactDetails = draftClaim.representative.contactDetails
    draftClaim.claimant['representative'].companyContactDetails.phone = draftClaim.representative.contactDetails.phoneNumber

    delete draftClaim.claimant['representative'].contactDetails
    delete draftClaim.claimant['representative'].companyContactDetails.phoneNumber
    delete draftClaim.claimant['representative'].address
    delete draftClaim.representative

  }

  private static convertDefendantDetails (draftClaim: DraftLegalClaim): void {
    draftClaim.defendants.map((defendant: Defendant) => {
      defendant['name'] = defendant.defendantDetails.fullName
      defendant['type'] = defendant.defendantDetails.type.dataStoreValue
      return defendant
    })
  }

}
