import { Serializable } from 'app/models/serializable'
import { IsDefined, IsIn, IsOptional, MaxLength, ValidateIf } from 'class-validator'
import { PartyTypes as ClaimantTypes } from 'app/forms/models/partyTypes'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly CLAIMANT_TYPE_REQUIRED: string = 'Choose a type of claimant'
  static readonly TITLE_REQUIRED: string = 'Enter a title'
  static readonly FULLNAME_REQUIRED: string = 'Enter a full name'
  static readonly ORGANISATION_NAME_REQUIRED: string = 'Enter an organisation name'
  static readonly COMPANY_HOUSE_NUMBER_REQUIRED: string = 'Enter a valid Companies House number'
  static readonly CONTENT_TOO_LONG: string = 'You’ve entered too many characters'
}

export class ClaimantDetails implements Serializable<ClaimantDetails> {

  @IsDefined({ message: ValidationErrors.CLAIMANT_TYPE_REQUIRED })
  @IsIn(ClaimantTypes.all(), { message: ValidationErrors.CLAIMANT_TYPE_REQUIRED })
  type?: ClaimantTypes

  @ValidateIf(o => o.type === ClaimantTypes.INDIVIDUAL)
  @IsOptional()
  @IsDefined({ message: ValidationErrors.TITLE_REQUIRED })
  @MaxLength(35, { message: ValidationErrors.CONTENT_TOO_LONG })
  title?: string

  @ValidateIf(o => o.type === ClaimantTypes.INDIVIDUAL)
  @IsDefined({ message: ValidationErrors.FULLNAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.FULLNAME_REQUIRED })
  @MaxLength(70, { message: ValidationErrors.CONTENT_TOO_LONG })
  fullName?: string

  @ValidateIf(o => o.type === ClaimantTypes.ORGANISATION)
  @IsDefined({ message: ValidationErrors.ORGANISATION_NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.ORGANISATION_NAME_REQUIRED })
  @MaxLength(255, { message: ValidationErrors.CONTENT_TOO_LONG })
  organisation?: string

  @ValidateIf(o => o.type === ClaimantTypes.ORGANISATION)
  @IsOptional()
  @IsDefined({ message: ValidationErrors.COMPANY_HOUSE_NUMBER_REQUIRED })
  @MaxLength(8, { message: ValidationErrors.CONTENT_TOO_LONG })
  companyHouseNumber?: string

  constructor (type?: ClaimantTypes, title?: string, fullName?: string, organisation?: string, companyHouseNumber?: string) {
    this.type = type
    this.title = title
    this.fullName = fullName
    this.organisation = organisation
    this.companyHouseNumber = companyHouseNumber
  }

  static fromObject (value?: any): ClaimantDetails {
    if (value != null) {
      let type

      if (value.type) {
        type = ClaimantTypes.all()
          .filter(type => {
            return type.value === value.type
          })
          .pop()
      }

      return new ClaimantDetails(type, value.title, value.fullName, value.organisation, value.companyHouseNumber)
    }

    return new ClaimantDetails()
  }

  deserialize (input?: any): ClaimantDetails {
    if (input) {
      this.type = input.type
      this.title = input.title
      this.fullName = input.fullName
      this.organisation = input.organisation
      this.companyHouseNumber = input.companyHouseNumber
    }

    return this
  }

}
