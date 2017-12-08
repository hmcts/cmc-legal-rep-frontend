import { Serializable } from 'app/models/serializable'
import { IsDefined, IsIn, IsOptional, MaxLength, ValidateIf } from 'class-validator'
import { PartyType as DefendantTypes } from 'app/common/partyType'
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
  @IsOptional()
  @IsDefined({ message: CommonValidationErrors.TITLE_REQUIRED })
  @MaxLength(35, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  title?: string

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

  @ValidateIf(o => o.type === DefendantTypes.SOLE_TRADER)
  @IsDefined({ message: CommonValidationErrors.FULLNAME_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.FULLNAME_REQUIRED })
  @MaxLength(70, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  soleTraderName?: string

  @ValidateIf(o => o.type === DefendantTypes.SOLE_TRADER)
  @IsOptional()
  @MaxLength(255, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  businessName?: string

  constructor (type?: DefendantTypes, title?: string, fullName?: string, organisation?: string, companyHouseNumber?: string,
               soleTraderName?: string, businessName?: string) {
    this.type = type
    this.title = title
    this.fullName = fullName
    this.organisation = organisation
    this.companyHouseNumber = companyHouseNumber
    this.soleTraderName = soleTraderName
    this.businessName = businessName
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

      return new DefendantDetails(type, value.title, value.fullName, value.organisation, value.companyHouseNumber,
                                  value.soleTraderName, value.businessName)
    }

    return new DefendantDetails()
  }

  deserialize (input?: any): DefendantDetails {
    if (input) {
      this.type = input.type
      this.title = input.title
      this.fullName = input.fullName
      this.organisation = input.organisation
      this.companyHouseNumber = input.companyHouseNumber
      this.businessName = input.businessName
      this.soleTraderName = input.soleTraderName
    }

    return this
  }

  toString (): string {
    switch (this.type.value) {
      case DefendantTypes.INDIVIDUAL.value:
        return (this.title ? this.title + ' ' : '') + this.fullName
      case DefendantTypes.ORGANISATION.value:
        return this.organisation
      case DefendantTypes.SOLE_TRADER.value:
        return this.businessName ? this.soleTraderName + ' trading as ' + this.businessName : this.soleTraderName
    }
  }

}
