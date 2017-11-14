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
