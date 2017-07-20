import { IsOptional, MaxLength } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly PREFERRED_COURT_TOO_LONG: string = 'You’ve entered too many characters'
}

export default class PreferredCourt implements Serializable<PreferredCourt> {

  @MaxLength( 80, { message: ValidationErrors.PREFERRED_COURT_TOO_LONG } )
  @IsOptional()
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
