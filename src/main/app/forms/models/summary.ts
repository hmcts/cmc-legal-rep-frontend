import { MaxLength, IsDefined } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly SUMMARY_REQUIRED: string = 'Enter a brief description of the claim'
}

export default class Summary implements Serializable<Summary> {
  @IsDefined({ message: ValidationErrors.SUMMARY_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.SUMMARY_REQUIRED })
  @MaxLength(700, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  text?: string

  constructor (text?: string) {
    this.text = text
  }

  deserialize (input: any): Summary {
    if (input) {
      this.text = input.text
    }
    return this
  }
}
