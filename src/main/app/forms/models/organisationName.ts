import { IsDefined, MaxLength } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isNotBlank'

export class ValidationErrors {
  static readonly ORGANISATION_NAME_REQUIRED: string = 'Enter your organisation name'
  static readonly ORGANISATION_NAME_TOO_LONG: string = 'You’ve entered too many characters'
}

export class OrganisationName implements Serializable<OrganisationName> {

  @IsDefined({ message: ValidationErrors.ORGANISATION_NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.ORGANISATION_NAME_REQUIRED })
  @MaxLength(255, { message: ValidationErrors.ORGANISATION_NAME_TOO_LONG })
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
