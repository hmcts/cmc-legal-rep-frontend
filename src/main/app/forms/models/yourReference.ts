import { IsOptional, MaxLength } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly YOUR_REFERENCE_TOO_LONG: string = 'You’ve entered too many characters'
}

export class YourReference implements Serializable<YourReference> {

  @MaxLength(25, { message: ValidationErrors.YOUR_REFERENCE_TOO_LONG })
  @IsOptional()
  reference?: string

  constructor (reference?: string) {
    this.reference = reference
  }

  static fromObject (value?: any): YourReference {
    if (value == null) {
      return value
    }
    return new YourReference(value.reference)
  }

  deserialize (input?: any): YourReference {
    if (input) {
      this.reference = input.reference
    }

    return this
  }
}
