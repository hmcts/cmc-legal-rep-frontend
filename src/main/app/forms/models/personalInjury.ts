import { IsDefined, IsIn, ValidateIf } from 'class-validator'
import { Serializable } from 'models/serializable'
import { YesNo } from 'forms/models/yesNo'
import { GeneralDamages } from 'forms/models/generalDamages'

export class ValidationErrors {
  static readonly PERSONAL_INJURY_REQUIRED: string = 'Choose yes if it’s a personal injury claim'
  static readonly GENERAL_DAMAGES_REQUIRED: string = 'Choose an amount'
}

export class PersonalInjury implements Serializable<PersonalInjury> {

  @IsDefined({ message: ValidationErrors.PERSONAL_INJURY_REQUIRED })
  @IsIn(YesNo.all(), { message: ValidationErrors.PERSONAL_INJURY_REQUIRED })
  personalInjury?: YesNo

  @ValidateIf(o => o.personalInjury === YesNo.YES)
  @IsDefined({ message: ValidationErrors.GENERAL_DAMAGES_REQUIRED })
  @IsIn(GeneralDamages.all(), { message: ValidationErrors.GENERAL_DAMAGES_REQUIRED })
  generalDamages?: GeneralDamages

  constructor (personalInjury?: YesNo, generalDamages?: GeneralDamages) {
    this.personalInjury = personalInjury
    this.generalDamages = generalDamages
  }

  static fromObject (value?: any): PersonalInjury {
    let generalDamagesValue
    let personalInjuryValue

    if (value) {
      if (value.generalDamages) {
        generalDamagesValue = GeneralDamages.all()
          .filter(generalDamages => generalDamages.value === value.generalDamages)
          .pop()
      }
      if (value.personalInjury) {
        personalInjuryValue = YesNo.all()
          .filter(personalInjury => personalInjury.value === value.personalInjury)
          .pop()
      }
      return new PersonalInjury(personalInjuryValue, generalDamagesValue)
    } else {
      return new PersonalInjury()
    }
  }

  deserialize (input?: any): PersonalInjury {
    if (input) {
      this.personalInjury = input.personalInjury
      this.generalDamages = input.generalDamages
    }
    return this
  }
}
