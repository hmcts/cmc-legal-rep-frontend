import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'
import Defendant from 'drafts/models/defendant'
import { OtherDamages } from 'forms/models/otherDamages'
import { YesNo } from 'forms/models/yesNo'
import Claimant from 'app/drafts/models/claimant'
import Representative from 'app/drafts/models/representative'
import { PartyType as DefendantType } from 'app/common/partyType'

export class ClaimModelConverter {

  static convert (draftClaim: DraftLegalClaim): object {
    ClaimModelConverter.convertClaimantDetails(draftClaim)
    ClaimModelConverter.convertDefendantDetails(draftClaim)

    draftClaim['reason'] = draftClaim.summary.text
    delete draftClaim.summary

    if (draftClaim.personalInjury.personalInjury && draftClaim.personalInjury.personalInjury.value === YesNo.YES.value) {
      if (draftClaim.personalInjury.generalDamages) {
        draftClaim.personalInjury.generalDamages = draftClaim.personalInjury.generalDamages.dataStoreValue as any
      }

      delete draftClaim.personalInjury.personalInjury
    } else {
      delete draftClaim.personalInjury
    }

    if (draftClaim.amount.canNotState()) {
      draftClaim.amount['type'] = 'not_known'
      delete draftClaim.amount.cannotState
    } else {
      draftClaim.amount['type'] = 'range'
    }

    if (draftClaim.yourReference) {
      draftClaim['externalReferenceNumber'] = draftClaim.yourReference.reference
    }
    delete draftClaim.yourReference

    if (draftClaim.preferredCourt) {
      draftClaim.preferredCourt = draftClaim.preferredCourt.name as any
    } else {
      delete draftClaim.preferredCourt
    }

    if (draftClaim.housingDisrepair.housingDisrepair && draftClaim.housingDisrepair.housingDisrepair.value === YesNo.YES.value) {

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
    delete draftClaim.representative

    return draftClaim
  }

  private static convertClaimantDetails (draftClaim: DraftLegalClaim): void {
    const representative: Representative = draftClaim.representative

    draftClaim.claimants.map((claimant: Claimant) => {

      claimant['type'] = claimant.claimantDetails.type.dataStoreValue

      if (claimant.claimantDetails.organisation) {
        claimant['name'] = claimant.claimantDetails.organisation
      } else {
        claimant['name'] = claimant.claimantDetails.fullName
      }

      if (claimant.claimantDetails.companyHouseNumber) {
        claimant['companiesHouseNumber'] = claimant.claimantDetails.companyHouseNumber
      }
      delete claimant.claimantDetails

      claimant['representative'] = new Representative().deserialize(representative)
      claimant['representative'].organisationName = representative.organisationName.name
      claimant['representative'].organisationAddress = representative.address
      claimant['representative'].organisationContactDetails = representative.contactDetails

      if (representative.contactDetails.phoneNumber) {
        claimant['representative'].organisationContactDetails.phone = representative.contactDetails.phoneNumber
        delete claimant['representative'].organisationContactDetails.phoneNumber
      }

      delete claimant['representative'].contactDetails
      delete claimant['representative'].address
      return claimant
    })

  }

  private static convertDefendantDetails (draftClaim: DraftLegalClaim): void {
    draftClaim.defendants.map((defendant: Defendant) => {
      defendant['type'] = defendant.defendantDetails.type.dataStoreValue

      switch (defendant.defendantDetails.type.value) {
        case DefendantType.INDIVIDUAL.value:
          defendant['name'] = defendant.defendantDetails.fullName
          break
        case DefendantType.ORGANISATION.value:
          defendant['name'] = defendant.defendantDetails.organisation
          if (defendant.defendantDetails.companyHouseNumber) {
            defendant['companiesHouseNumber'] = defendant.defendantDetails.companyHouseNumber
          }
          break
        case DefendantType.SOLE_TRADER.value:
          defendant['name'] = defendant.defendantDetails.soleTraderName
          if (defendant.defendantDetails.businessName) {
            defendant['businessName'] = defendant.defendantDetails.businessName
          }
          break
      }

      delete defendant.defendantDetails

      if (defendant.defendantRepresented.isDefendantRepresented.value === YesNo.YES.value) {
        defendant.representative['organisationName'] = defendant.defendantRepresented.organisationName as any
        defendant.representative['organisationAddress'] = defendant.representative.address
        defendant.representative['organisationContactDetails'] = defendant.representative.contactDetails
        delete defendant.defendantRepresented
        delete defendant.representative.address
        delete defendant.representative.contactDetails
      } else {
        delete defendant.representative
        delete defendant.defendantRepresented
      }
      const serviceAddress = defendant.serviceAddress
      if (serviceAddress.defendantsAddress && serviceAddress.defendantsAddress.value === YesNo.NO.value) {
        delete defendant.serviceAddress.defendantsAddress
      } else {
        delete defendant.serviceAddress
      }
      return defendant
    })
  }

}
