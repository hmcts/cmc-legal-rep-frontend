import { IsDefined, MaxLength } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isNotBlank'

export class ValidationErrors {
  static readonly COMPANY_NAME_REQUIRED: string = 'Enter your organisation name'
  static readonly COMPANY_NAME_TOO_LONG: string = 'You’ve entered too many characters'
}

export default class CompanyName implements Serializable<CompanyName> {

  @IsDefined( { message: ValidationErrors.COMPANY_NAME_REQUIRED } )
  @IsNotBlank( { message: ValidationErrors.COMPANY_NAME_REQUIRED } )
  @MaxLength( 255, { message: ValidationErrors.COMPANY_NAME_TOO_LONG } )
  name?: string

  constructor (name?: string) {
    this.name = name
  }

  static fromObject (value?: any): CompanyName {
    if (value == null) {
      return value
    }
    return new CompanyName( value.name )
  }

  deserialize (input?: any): CompanyName {
    if (input) {
      this.name = input.name
    }
    return this
  }
}
