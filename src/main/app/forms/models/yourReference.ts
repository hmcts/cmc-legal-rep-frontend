import { MaxLength, IsOptional } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly YOUR_REFERENCE_TOO_LONG: string = 'Enter a reference no longer than $constraint1 characters'
}

export class YourReference implements Serializable<YourReference> {

  @MaxLength(25, { message: ValidationErrors.YOUR_REFERENCE_TOO_LONG })
  @IsOptional()
  yourReference?: string

  constructor (yourReference?: string) {
    this.yourReference = yourReference
  }

  static fromObject (value?: any): YourReference {
    if (value == null) {
      return value
    }

    const instance = new YourReference(value.yourReference)

    return instance
  }

  deserialize (input?: any): YourReference {
    if (input) {
      this.yourReference = input.yourReference
    }
    return this
  }
}
