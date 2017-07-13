import { IsDefined, ValidateIf, IsIn } from 'class-validator'
import { Serializable } from 'models/serializable'
import { YesNo } from 'forms/models/yesNo'
import { GeneralDamages } from 'forms/models/generalDamages'

export class ValidationErrors {
  static readonly HOUSING_DISREPAIR_REQUIRED: string = 'Please select yes or no'
  static readonly GENERAL_DAMAGES_REQUIRED: string = 'Please select more or less'
  static readonly OTHER_DAMAGES_REQUIRED: string = 'Please select how much you expect to recover'
}

export class OtherDamages {
  static readonly LESS: string = 'less'
  static readonly MORE: string = 'more'
  static readonly NONE: string = 'none'

  static all (): string[] {
    return [
      OtherDamages.LESS,
      OtherDamages.MORE,
      OtherDamages.NONE
    ]
  }
}

export class HousingDisrepair implements Serializable<HousingDisrepair> {

  @IsDefined({ message: ValidationErrors.HOUSING_DISREPAIR_REQUIRED })
  @IsIn(YesNo.all(), { message: ValidationErrors.HOUSING_DISREPAIR_REQUIRED })
  housingDisrepair?: string

  @ValidateIf(o => o.housingDisrepair === YesNo.YES)
  @IsDefined({ message: ValidationErrors.GENERAL_DAMAGES_REQUIRED })
  @IsIn(GeneralDamages.all(), { message: ValidationErrors.GENERAL_DAMAGES_REQUIRED })
  generalDamages?: string

  @ValidateIf(o => o.housingDisrepair === YesNo.YES)
  @IsDefined({ message: ValidationErrors.OTHER_DAMAGES_REQUIRED })
  @IsIn(OtherDamages.all(), { message: ValidationErrors.OTHER_DAMAGES_REQUIRED })
  otherDamages?: string

  constructor (housingDisrepair?: string, generalDamages?: string, otherDamages?: string) {
    this.housingDisrepair = housingDisrepair
    this.generalDamages = generalDamages
    this.otherDamages = otherDamages
  }

  static fromObject (value?: any): HousingDisrepair {
    if (value == null) {
      return value
    }

    const instance = new HousingDisrepair(value.housingDisrepair, value.generalDamages, value.otherDamages)

    return instance
  }

  deserialize (input?: any): HousingDisrepair {
    if (input) {
      this.housingDisrepair = input.housingDisrepair
      this.generalDamages = input.generalDamages
      this.otherDamages = input.otherDamages
    }
    return this
  }
}
