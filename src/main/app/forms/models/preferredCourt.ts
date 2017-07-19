import { IsDefined, MaxLength } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly PREFERRED_COURT_REQUIRED: string = 'Enter a county court'
  static readonly PREFERRED_COURT_TOO_LONG: string = 'You’ve entered too many characters'
}

export default class PreferredCourt implements Serializable<PreferredCourt> {

  @IsDefined( { message: ValidationErrors.PREFERRED_COURT_REQUIRED } )
  @IsNotBlank( { message: ValidationErrors.PREFERRED_COURT_REQUIRED } )
  @MaxLength( 80, { message: ValidationErrors.PREFERRED_COURT_TOO_LONG } )
  name?: string

  constructor (name?: string) {
    this.name = name
  }

  static fromObject (value?: any): PreferredCourt {
    if (value == null) {
      return value
    }

    return new PreferredCourt( value.name )

  }

  deserialize (input: any): PreferredCourt {
    if (input) {
      this.name = input.name
    }
    return this
  }
}
