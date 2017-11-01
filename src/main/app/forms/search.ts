import { IsDefined, MaxLength } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isNotBlank'

export class ValidationErrors {
  static readonly REFERENCE_REQUIRED: string = 'Enter your claim number'
  static readonly REFERENCE_TOO_LONG: string = 'You’ve entered too many characters'
}

export class Search implements Serializable<Search> {

  @IsDefined({ message: ValidationErrors.REFERENCE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REFERENCE_REQUIRED })
  @MaxLength(8, { message: ValidationErrors.REFERENCE_TOO_LONG })
  reference?: string

  constructor (reference?: string) {
    this.reference = reference
  }

  static fromObject (value?: any): Search {
    if (value == null) {
      return value
    }
    return new Search(value.reference)
  }

  deserialize (input?: any): Search {
    if (input) {
      this.reference = input.reference
    }
    return this
  }
}
