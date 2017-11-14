import { Serializable } from 'app/models/serializable'
import { IsDefined, MaxLength } from 'class-validator'
import { IsNotBlank } from 'app/forms/validation/validators/isNotBlank'

export class ValidationErrors {
  static readonly CLAIMANT_TYPE_REQUIRED: string = 'Choose a type of claimant'
  static readonly FULLNAME_REQUIRED: string = 'Enter a full name'
  static readonly ORGANISATION_NAME_REQUIRED: string = 'Enter an organisation name'
  static readonly CONTENT_TOO_LONG: string = 'You’ve entered too many characters'
}

export class ClaimantName implements Serializable<ClaimantName> {

  @IsDefined({ message: ValidationErrors.FULLNAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.FULLNAME_REQUIRED })
  @MaxLength(70, { message: ValidationErrors.CONTENT_TOO_LONG })
  value?: string

  constructor (value?: string) {
    this.value = value
  }

  static fromObject (name?: any): ClaimantName {
    if (name != null) {
      return new ClaimantName(name.value)
    }

    return new ClaimantName()
  }

  deserialize (input?: any): ClaimantName {
    if (input) {
      this.value = input.value
    }

    return this
  }
}
