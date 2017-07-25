import { IsDefined, MaxLength } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly NAME_REQUIRED: string = 'Enter name'
  static readonly NAME_TOO_LONG: string = 'You’ve entered too many characters'
}

export default class Name implements Serializable<Name> {

  @IsDefined({ message: ValidationErrors.NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED })
  @MaxLength(255, { message: ValidationErrors.NAME_TOO_LONG })
  text?: string

  constructor (text?: string) {
    this.text = text
  }

  static fromObject (value?: any): Name {
    if (value != null) {
      return new Name(value.text)
    }

    return value
  }

  deserialize (input?: any): Name {
    if (input) {
      this.text = input.text
    }

    return this
  }
}
