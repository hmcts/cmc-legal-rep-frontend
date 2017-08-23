import { IsDefined, IsEnum } from 'class-validator'
import { Serializable } from 'models/serializable'
import { YesNo } from 'forms/models/yesNo'

export class ValidationErrors {
  static readonly DEFENDANT_ADDITION_REQUIRED: string = 'Choose yes if need to add another defendant'
}

export class DefendantAddition implements Serializable<DefendantAddition> {

  @IsDefined({ message: ValidationErrors.DEFENDANT_ADDITION_REQUIRED })
  @IsEnum(YesNo, { message: ValidationErrors.DEFENDANT_ADDITION_REQUIRED })
  isAddDefendant?: string

  constructor (isAddDefendant?: string) {
    this.isAddDefendant = isAddDefendant
  }

  static fromObject (value?: any): DefendantAddition {
    let isAddDefendant

    if (value) {
      if (value.isAddDefendant) {
        isAddDefendant = YesNo.all()
          .filter(yesNo => yesNo === value.isAddDefendant)
          .pop()
      }

      return new DefendantAddition(isAddDefendant)
    } else {
      return new DefendantAddition()
    }
  }

  deserialize (input?: any): DefendantAddition {
    if (input) {
      this.isAddDefendant = input.isAddDefendant
    }
    return this
  }
}
