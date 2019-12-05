import { IsDefined, MaxLength } from '@hmcts/class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly NAME_REQUIRED: string = 'Enter name'
}

export default class Name implements Serializable<Name> {

  @IsDefined({ message: ValidationErrors.NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NAME_REQUIRED })
  @MaxLength(255, { message: CommonValidationErrors.CONTENT_TOO_LONG })
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
