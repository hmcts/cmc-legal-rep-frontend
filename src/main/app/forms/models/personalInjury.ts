import { IsDefined, ValidateIf } from 'class-validator'
import { Serializable } from 'models/serializable'
import { YesNo } from 'forms/models/yesNo'

export class ValidationErrors {
  static readonly PERSONAL_INJURY_REQUIRED: string = 'Please select yes or no'
  static readonly GENERAL_DAMAGES_REQUIRED: string = 'Please select more or less'
}

export class PersonalInjury implements Serializable<PersonalInjury> {

  @IsDefined({ message: ValidationErrors.PERSONAL_INJURY_REQUIRED })
  personalInjury?: string

  @ValidateIf(o => o.personalInjury === YesNo.YES)
  @IsDefined({ message: ValidationErrors.GENERAL_DAMAGES_REQUIRED })
  generalDamages?: string

  constructor (personalInjury?: string, generalDamages?: string) {
    this.personalInjury = personalInjury
    this.generalDamages = generalDamages
  }

  static fromObject (value?: any): PersonalInjury {
    if (value == null) {
      return value
    }

    const instance = new PersonalInjury(value.personalInjury, value.generalDamages)

    return instance
  }

  deserialize (input?: any): PersonalInjury {
    if (input) {
      this.personalInjury = input.personalInjury
    }
    return this
  }
}
