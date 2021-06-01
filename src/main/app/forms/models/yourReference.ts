import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { IsOptional, MaxLength, IsDefined } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly REFERENCE_NAME_REQUIRED: string = 'Enter your reference for this claim'
}

export class YourReference implements Serializable<YourReference> {

  @IsDefined({ message: ValidationErrors.REFERENCE_NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REFERENCE_NAME_REQUIRED })
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
