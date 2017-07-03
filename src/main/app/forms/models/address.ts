import { IsDefined, MaxLength } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'

import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly FIRST_LINE_REQUIRED: string = 'Enter first address line'
  static readonly FIRST_LINE_TOO_LONG: string = 'Enter first address line no longer than $constraint1 characters'

  static readonly SECOND_LINE_TOO_LONG: string = 'Enter second address line no longer than $constraint1 characters'

  static readonly CITY_NOT_VALID: string = 'Enter city no longer than $constraint1 characters'

  static readonly POSTCODE_REQUIRED: string = 'Enter postcode'
  static readonly POSTCODE_NOT_VALID: string = 'Enter postcode no longer than $constraint1 characters'
}

export class Address implements Serializable<Address> {

  @IsDefined({ message: ValidationErrors.FIRST_LINE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.FIRST_LINE_REQUIRED })
  @MaxLength(50, { message: ValidationErrors.FIRST_LINE_TOO_LONG })
  line1?: string
  @MaxLength(50, { message: ValidationErrors.SECOND_LINE_TOO_LONG })
  line2?: string
  @MaxLength(50, { message: ValidationErrors.CITY_NOT_VALID })
  city?: string
  @IsDefined({ message: ValidationErrors.POSTCODE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.POSTCODE_REQUIRED })
  @MaxLength(8, { message: ValidationErrors.POSTCODE_NOT_VALID })
  postcode?: string

  constructor (line1?: string, line2?: string, city?: string, postcode?: string) {
    this.line1 = line1
    this.line2 = line2
    this.city = city
    this.postcode = postcode
  }

  deserialize (input?: any): Address {
    if (input) {
      this.line1 = input.line1
      this.line2 = input.line2
      this.city = input.city
      this.postcode = input.postcode
    }
    return this
  }
}
