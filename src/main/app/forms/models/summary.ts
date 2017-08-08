import { MaxLength, IsDefined } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isNotBlank'

export class ValidationErrors {
  static readonly SUMMARY_REQUIRED: string = 'Enter a brief description of the claim'
  static readonly SUMMARY_TOO_LONG: string = 'You’ve entered too many characters'
}

export default class Summary implements Serializable<Summary> {
  @IsDefined({ message: ValidationErrors.SUMMARY_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.SUMMARY_REQUIRED })
  @MaxLength(700, { message: ValidationErrors.SUMMARY_TOO_LONG })
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
