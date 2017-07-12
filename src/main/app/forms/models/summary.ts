import { MaxLength, IsDefined } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Please summarise the claim'
  static readonly REASON_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
}

export default class Summary implements Serializable<Summary> {
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(99000, { message: ValidationErrors.REASON_TOO_LONG })
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
