import { IsDefined, MaxLength } from '@hmcts/class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly ORGANISATION_NAME_REQUIRED: string = 'Enter your organisation name'
}

export class OrganisationName implements Serializable<OrganisationName> {

  @IsDefined({ message: ValidationErrors.ORGANISATION_NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.ORGANISATION_NAME_REQUIRED })
  @MaxLength(255, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  name?: string

  constructor (name?: string) {
    this.name = name
  }

  static fromObject (value?: any): OrganisationName {
    if (value == null) {
      return value
    }
    return new OrganisationName(value.name)
  }

  deserialize (input?: any): OrganisationName {
    if (input) {
      this.name = input.name
    }
    return this
  }
}
