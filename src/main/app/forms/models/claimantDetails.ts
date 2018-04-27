import { Serializable } from 'models/serializable'
import { IsDefined, IsIn, IsOptional, MaxLength, ValidateIf } from 'class-validator'
import { PartyType as ClaimantType } from 'common/partyType'
import { IsNotBlank } from 'forms/validation/validators/isNotBlank'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly CLAIMANT_TYPE_REQUIRED: string = 'Choose a type of claimant'
}

export class ClaimantDetails implements Serializable<ClaimantDetails> {

  @IsDefined({ message: ValidationErrors.CLAIMANT_TYPE_REQUIRED })
  @IsIn(ClaimantType.all(), { message: ValidationErrors.CLAIMANT_TYPE_REQUIRED })
  type?: ClaimantType

  @ValidateIf(o => o.type === ClaimantType.INDIVIDUAL)
  @IsDefined({ message: CommonValidationErrors.FULLNAME_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.FULLNAME_REQUIRED })
  @MaxLength(70, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  fullName?: string

  @ValidateIf(o => o.type === ClaimantType.ORGANISATION)
  @IsDefined({ message: CommonValidationErrors.ORGANISATION_NAME_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.ORGANISATION_NAME_REQUIRED })
  @MaxLength(255, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  organisation?: string

  @ValidateIf(o => o.type === ClaimantType.ORGANISATION)
  @IsOptional()
  @IsDefined({ message: CommonValidationErrors.COMPANY_HOUSE_NUMBER_REQUIRED })
  @MaxLength(8, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  companyHouseNumber?: string

  constructor (type?: ClaimantType, fullName?: string, organisation?: string, companyHouseNumber?: string) {
    this.type = type
    this.fullName = fullName
    this.organisation = organisation
    this.companyHouseNumber = companyHouseNumber
  }

  static fromObject (value?: any): ClaimantDetails {
    if (value != null) {
      let type

      if (value.type) {
        type = ClaimantType.all()
          .filter(type => {
            return type.value === value.type
          })
          .pop()
      }

      return new ClaimantDetails(type, value.fullName, value.organisation, value.companyHouseNumber)
    }

    return new ClaimantDetails()
  }

  deserialize (input?: any): ClaimantDetails {
    if (input) {
      this.type = input.type
      this.fullName = input.fullName
      this.organisation = input.organisation
      this.companyHouseNumber = input.companyHouseNumber
    }

    return this
  }

  toString (): string {
    return this.type.value === ClaimantType.INDIVIDUAL.value ? this.fullName : this.organisation
  }
}
