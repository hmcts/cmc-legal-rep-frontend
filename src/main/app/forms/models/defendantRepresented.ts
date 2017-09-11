import { IsDefined, IsIn, MaxLength, ValidateIf } from 'class-validator'
import { Serializable } from 'models/serializable'
import { YesNo } from 'forms/models/yesNo'
import { IsNotBlank } from 'app/forms/validation/validators/isNotBlank'

export class ValidationErrors {
  static readonly DEFENDANT_IS_REPRESENTED_REQUIRED: string = 'Choose yes if defendant is represented'
  static readonly COMPANY_NAME_REQUIRED: string = 'Enter defendant representative organisation name'
  static readonly COMPANY_NAME_TOO_LONG: string = 'Enter the legal representative’s organisation name'}

export class DefendantRepresented implements Serializable<DefendantRepresented> {

  @IsDefined({ message: ValidationErrors.DEFENDANT_IS_REPRESENTED_REQUIRED })
  @IsIn(YesNo.all(), { message: ValidationErrors.DEFENDANT_IS_REPRESENTED_REQUIRED })
  isDefendantRepresented?: string

  @ValidateIf(o => o.isDefendantRepresented === YesNo.YES)
  @IsDefined( { message: ValidationErrors.COMPANY_NAME_REQUIRED } )
  @IsNotBlank( { message: ValidationErrors.COMPANY_NAME_REQUIRED } )
  @MaxLength( 255, { message: ValidationErrors.COMPANY_NAME_TOO_LONG } )
  organisationName?: string

  constructor (isDefendantRepresented?: string, organisationName?: string) {
    this.isDefendantRepresented = isDefendantRepresented
    this.organisationName = organisationName
  }

  static fromObject (value?: any): DefendantRepresented {
    let isDefendantRepresented

    if (value) {
      if (value.isDefendantRepresented) {
        isDefendantRepresented = YesNo.all()
          .filter(yesNo => yesNo === value.isDefendantRepresented)
          .pop()
      }

      return new DefendantRepresented(isDefendantRepresented, value.organisationName)
    } else {
      return new DefendantRepresented()
    }
  }

  deserialize (input?: any): DefendantRepresented {
    if (input) {
      this.isDefendantRepresented = input.isDefendantRepresented
      this.organisationName = input.organisationName
    }
    return this
  }
}
