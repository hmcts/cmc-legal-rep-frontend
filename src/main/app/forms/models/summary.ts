import { MaxLength, IsDefined } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly SUMMARY_REQUIRED: string = 'Please summarise the claim'
  static readonly SUMMARY_TOO_LONG: string = 'Please keep summary below $constraint1 characters'
}

export default class Summary implements Serializable<Summary> {
  @IsDefined({ message: ValidationErrors.SUMMARY_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.SUMMARY_REQUIRED })
  @MaxLength(700, { message: ValidationErrors.SUMMARY_TOO_LONG })
  summary?: string

  constructor (summary?: string) {
    this.summary = summary
  }

  deserialize (input: any): Summary {
    if (input) {
      this.summary = input.summary
    }
    return this
  }
}
