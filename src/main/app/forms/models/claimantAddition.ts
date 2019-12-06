import { IsDefined, IsEnum } from '@hmcts/class-validator'
import { Serializable } from 'models/serializable'
import { YesNo } from 'forms/models/yesNo'

export class ValidationErrors {
  static readonly CLAIMANT_ADDITION_REQUIRED: string = 'Choose yes if need to add another claimant'
}

export class ClaimantAddition implements Serializable<ClaimantAddition> {

  @IsDefined({ message: ValidationErrors.CLAIMANT_ADDITION_REQUIRED })
  @IsEnum(YesNo, { message: ValidationErrors.CLAIMANT_ADDITION_REQUIRED })
  isAddClaimant?: YesNo

  constructor (isAddClaimant?: YesNo) {
    this.isAddClaimant = isAddClaimant
  }

  static fromObject (value?: any): ClaimantAddition {
    let isAddClaimant

    if (value) {
      if (value.isAddClaimant) {
        isAddClaimant = YesNo.all()
          .filter(yesNo => yesNo.value === value.isAddClaimant)
          .pop()
      }

      return new ClaimantAddition(isAddClaimant)
    } else {
      return new ClaimantAddition()
    }
  }

  deserialize (input?: any): ClaimantAddition {
    if (input) {
      this.isAddClaimant = input.isAddClaimant
    }
    return this
  }
}
