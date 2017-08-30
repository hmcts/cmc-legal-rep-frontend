import DraftLegalClaim from 'drafts/models/draftLegalClaim'
import Defendant from 'drafts/models/defendant'
import { OtherDamages } from 'forms/models/otherDamages'
import { YesNo } from 'forms/models/yesNo'

export class ClaimModelConverter {

  static convert (draftClaim: DraftLegalClaim): object {
    this.convertClaimantDetails(draftClaim)
    this.convertDefendantDetails(draftClaim)

    draftClaim['reason'] = draftClaim.summary.text

    if (draftClaim.personalInjury.personalInjury && draftClaim.personalInjury.personalInjury === YesNo.YES) {
      if (draftClaim.personalInjury.generalDamages) {
        draftClaim.personalInjury.generalDamages = draftClaim.personalInjury.generalDamages.dataStoreValue as any
      }

      delete draftClaim.personalInjury.personalInjury
    } else {
      delete draftClaim.personalInjury
    }

    if (draftClaim.housingDisrepair.housingDisrepair && draftClaim.housingDisrepair.housingDisrepair === YesNo.YES) {

      if (draftClaim.housingDisrepair.generalDamages) {
        draftClaim.housingDisrepair['costOfRepairsDamages'] = draftClaim.housingDisrepair.generalDamages.dataStoreValue
        delete draftClaim.housingDisrepair.generalDamages
      }

      if (draftClaim.housingDisrepair.otherDamages) {
        draftClaim.housingDisrepair.otherDamages = draftClaim.housingDisrepair.otherDamages.dataStoreValue as any
        if (draftClaim.housingDisrepair.otherDamages as any === OtherDamages.NONE.dataStoreValue) {
          delete draftClaim.housingDisrepair.otherDamages
        }
      }

      delete draftClaim.housingDisrepair.housingDisrepair
    } else {
      delete draftClaim.housingDisrepair

    }

    draftClaim['feeAccountNumber'] = draftClaim.feeAccount.reference
    delete draftClaim.feeAccount

    return draftClaim
  }

  private static convertClaimantDetails (draftClaim: DraftLegalClaim): void {
    draftClaim.claimant['type'] = draftClaim.claimant.claimantDetails.type.dataStoreValue

    if (draftClaim.amount.canNotState()) {
      draftClaim.amount['type'] = 'not_known'
    } else {
      draftClaim.amount['type'] = 'range'
    }

    if (draftClaim.claimant.claimantDetails.title) {
      draftClaim.claimant['title'] = draftClaim.claimant.claimantDetails.title
    }

    if (draftClaim.claimant.claimantDetails.organisation) {
      draftClaim.claimant['name'] = draftClaim.claimant.claimantDetails.organisation
    } else {
      draftClaim.claimant['name'] = draftClaim.claimant.claimantDetails.fullName
    }

    draftClaim.claimant['representative'] = draftClaim.representative
    draftClaim.claimant['representative'].companyName = draftClaim.representative.organisationName.name
    draftClaim.claimant['representative'].companyAddress = draftClaim.representative.address
    draftClaim.claimant['representative'].companyContactDetails = draftClaim.representative.contactDetails
    draftClaim.claimant['representative'].companyContactDetails.phone = draftClaim.representative.contactDetails.phoneNumber

    delete draftClaim.claimant['representative'].organisationName
    if (draftClaim.yourReference.reference) {
      draftClaim.claimant['representative'].reference = draftClaim.yourReference.reference
    }
    if (draftClaim.preferredCourt.name) {
      draftClaim.claimant['representative'].preferredCourt = draftClaim.preferredCourt.name
    }

    delete draftClaim.claimant['representative'].contactDetails
    delete draftClaim.claimant['representative'].companyContactDetails.phoneNumber
    delete draftClaim.claimant['representative'].address
    delete draftClaim.representative
  }

  private static convertDefendantDetails (draftClaim: DraftLegalClaim): void {
    draftClaim.defendants.map((defendant: Defendant) => {
      if (defendant.defendantDetails.title) {
        defendant['title'] = defendant.defendantDetails.title
      }
      if (defendant.defendantDetails.organisation) {
        defendant['name'] = defendant.defendantDetails.organisation
      } else {
        defendant['name'] = defendant.defendantDetails.fullName
      }
      defendant['type'] = defendant.defendantDetails.type.dataStoreValue

      if (defendant.defendantRepresented.isDefendantRepresented.value === YesNo.YES.value) {
        defendant.representative['companyName'] = defendant.defendantRepresented.organisationName as any
        defendant.representative['companyAddress'] = defendant.representative.address

        delete defendant.defendantRepresented
        delete defendant.representative.address
        delete defendant.representative.organisationName
        delete defendant.representative.contactDetails
      } else {
        delete defendant.representative
        delete defendant.defendantRepresented
      }
      return defendant
    })
  }

}
