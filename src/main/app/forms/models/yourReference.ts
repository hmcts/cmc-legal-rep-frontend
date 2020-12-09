import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { IsOptional, MaxLength } from '@hmcts/class-validator'
import { Serializable } from 'models/serializable'

export class YourReference implements Serializable<YourReference> {

  @MaxLength(25, { message: CommonValidationErrors.CONTENT_TOO_LONG })
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
