import { IsDefined, IsIn, ValidateIf } from 'class-validator'
import { Serializable } from 'models/serializable'
import { YesNo } from 'forms/models/yesNo'
import { GeneralDamages } from 'forms/models/generalDamages'
import { OtherDamages } from 'forms/models/otherDamages'

export class ValidationErrors {
  static readonly HOUSING_DISREPAIR_REQUIRED: string = 'Choose yes if the claim is for housing disrepair'
  static readonly GENERAL_DAMAGES_REQUIRED: string = 'Choose an amount for general damages'
  static readonly OTHER_DAMAGES_REQUIRED: string = 'Choose an amount for other damages'
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
    let housingDisrepairValue
    let generalDamagesValue
    let otherDamagesValue

    if (value) {

      if (value.housingDisrepair) {
        housingDisrepairValue = YesNo.all()
          .filter(housingDisrepair => housingDisrepair === value.housingDisrepair)
          .pop()
      }

      if (value.generalDamages) {
        generalDamagesValue = GeneralDamages.all()
          .filter(generalDamages => generalDamages === value.generalDamages)
          .pop()
      }

      if (value.otherDamages) {
        otherDamagesValue = OtherDamages.all()
          .filter(otherDamages => otherDamages === value.otherDamages)
          .pop()
      }

      return new HousingDisrepair(housingDisrepairValue, generalDamagesValue, otherDamagesValue)
    } else {
      return new HousingDisrepair()
    }
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
