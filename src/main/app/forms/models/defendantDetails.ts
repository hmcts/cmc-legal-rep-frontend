import { Serializable } from 'models/serializable'
import { IsDefined, IsIn, IsOptional, MaxLength, ValidateIf } from '@hmcts/class-validator'
import { PartyType as DefendantType } from 'common/partyType'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly DEFENDANT_TYPE_REQUIRED: string = 'Choose a type of defendant'
}

export class DefendantDetails implements Serializable<DefendantDetails> {

  @IsDefined({ message: ValidationErrors.DEFENDANT_TYPE_REQUIRED })
  @IsIn(DefendantType.all(), { message: ValidationErrors.DEFENDANT_TYPE_REQUIRED })
  type?: DefendantType

  @ValidateIf(o => o.type === DefendantType.INDIVIDUAL)
  @IsDefined({ message: CommonValidationErrors.FULLNAME_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.FULLNAME_REQUIRED })
  @MaxLength(70, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  fullName?: string

  @ValidateIf(o => o.type === DefendantType.ORGANISATION)
  @IsDefined({ message: CommonValidationErrors.ORGANISATION_NAME_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.ORGANISATION_NAME_REQUIRED })
  @MaxLength(255, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  organisation?: string

  @ValidateIf(o => o.type === DefendantType.ORGANISATION)
  @IsOptional()
  @MaxLength(8, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  companyHouseNumber?: string

  @ValidateIf(o => o.type === DefendantType.SOLE_TRADER)
  @IsDefined({ message: CommonValidationErrors.FULLNAME_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.FULLNAME_REQUIRED })
  @MaxLength(70, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  soleTraderName?: string

  @ValidateIf(o => o.type === DefendantType.SOLE_TRADER)
  @IsOptional()
  @MaxLength(255, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  businessName?: string

  constructor (type?: DefendantType, fullName?: string, organisation?: string, companyHouseNumber?: string,
               soleTraderName?: string, businessName?: string) {
    this.type = type
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
        type = DefendantType.all()
          .filter(type => {
            return type.value === value.type
          })
          .pop()
      }

      return new DefendantDetails(type, value.fullName, value.organisation, value.companyHouseNumber,
                                  value.soleTraderName, value.businessName)
    }

    return new DefendantDetails()
  }

  deserialize (input?: any): DefendantDetails {
    if (input) {
      this.type = input.type
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
      case DefendantType.INDIVIDUAL.value:
        return this.fullName
      case DefendantType.ORGANISATION.value:
        return this.organisation
      case DefendantType.SOLE_TRADER.value:
        return this.businessName ? this.soleTraderName + ' trading as ' + this.businessName : this.soleTraderName
    }
  }

}
