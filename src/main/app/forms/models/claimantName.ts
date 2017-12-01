import { Serializable } from 'app/models/serializable'
import { IsDefined, MaxLength } from 'class-validator'
import { IsNotBlank } from 'app/forms/validation/validators/isNotBlank'

export class ValidationErrors {
  static readonly NAME_REQUIRED: string = 'Enter a name'
  static readonly CONTENT_TOO_LONG: string = 'You’ve entered too many characters'
}

export class ClaimantName implements Serializable<ClaimantName> {

  @IsDefined({ message: ValidationErrors.NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED })
  @MaxLength(70, { message: ValidationErrors.CONTENT_TOO_LONG })
  fullName?: string

  constructor (fullName?: string) {
    this.fullName = fullName
  }

  static fromObject (value?: any): ClaimantName {
    if (value != null) {
      return new ClaimantName(value.fullName)
    }

    return new ClaimantName()
  }

  deserialize (input?: any): ClaimantName {
    if (input) {
      this.fullName = input.fullName
    }

    return this
  }
}
