import { Serializable } from 'app/models/serializable'
import { IsDefined, IsIn, IsOptional, MaxLength, ValidateIf } from 'class-validator'
import { PartyTypes as DefendantTypes } from 'app/forms/models/partyTypes'
import { IsNotBlank } from 'app/forms/validation/validators/isNotBlank'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly DEFENDANT_TYPE_REQUIRED: string = 'Choose a type of defendant'
}

export class DefendantDetails implements Serializable<DefendantDetails> {

  @IsDefined({ message: ValidationErrors.DEFENDANT_TYPE_REQUIRED })
  @IsIn(DefendantTypes.all(), { message: ValidationErrors.DEFENDANT_TYPE_REQUIRED })
  type?: DefendantTypes

  @ValidateIf(o => o.type === DefendantTypes.INDIVIDUAL)
  @IsDefined({ message: CommonValidationErrors.FULLNAME_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.FULLNAME_REQUIRED })
  @MaxLength(70, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  fullName?: string

  @ValidateIf(o => o.type === DefendantTypes.ORGANISATION)
  @IsDefined({ message: CommonValidationErrors.ORGANISATION_NAME_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.ORGANISATION_NAME_REQUIRED })
  @MaxLength(255, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  organisation?: string

  @ValidateIf(o => o.type === DefendantTypes.ORGANISATION)
  @IsOptional()
  @MaxLength(8, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  companyHouseNumber?: string

  constructor (type?: DefendantTypes, fullName?: string, organisation?: string, companyHouseNumber?: string) {
    this.type = type
    this.fullName = fullName
    this.organisation = organisation
    this.companyHouseNumber = companyHouseNumber
  }

  static fromObject (value?: any): DefendantDetails {
    if (value != null) {
      let type

      if (value.type) {
        type = DefendantTypes.all()
          .filter(type => {
            return type.value === value.type
          })
          .pop()
      }

      return new DefendantDetails(type, value.fullName, value.organisation, value.companyHouseNumber)
    }

    return new DefendantDetails()
  }

  deserialize (input?: any): DefendantDetails {
    if (input) {
      this.type = input.type
      this.fullName = input.fullName
      this.organisation = input.organisation
      this.companyHouseNumber = input.companyHouseNumber
    }

    return this
  }

  toString (): string {
    return this.type.value === DefendantTypes.INDIVIDUAL.value ? this.fullName : this.organisation
  }

}
