import { IsDefined, MaxLength } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly REPRESENTATIVE_NAME_REQUIRED: string = 'Enter your company name'
  static readonly REPRESENTATIVE_NAME_TOO_LONG: string = 'You’ve entered too many characters'
}

export default class Representative implements Serializable<Representative> {

  @IsDefined( { message: ValidationErrors.REPRESENTATIVE_NAME_REQUIRED } )
  @IsNotBlank( { message: ValidationErrors.REPRESENTATIVE_NAME_REQUIRED } )
  @MaxLength( 255, { message: ValidationErrors.REPRESENTATIVE_NAME_TOO_LONG } )
  name?: string

  constructor (name?: string) {
    this.name = name
  }

  static fromObject (value?: any): Representative {
    if (value == null) {
      return value
    }

    const instance = new Representative( value.name )

    return instance
  }

  deserialize (input?: any): Representative {
    if (input) {
      this.name = input.name
    }
    return this
  }
}
