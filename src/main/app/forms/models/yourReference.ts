import { MaxLength, IsOptional } from 'class-validator'
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

    const instance = new YourReference(value.reference)

    return instance
  }

  deserialize (input?: any): YourReference {
    if (input) {
      this.reference = input.reference
    }
    return this
  }
}
