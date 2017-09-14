import { IsDefined, MaxLength } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isNotBlank'

import { Serializable } from 'models/serializable'
import { isUndefined } from 'util'

export class ValidationErrors {
  static readonly FIRST_LINE_REQUIRED: string = 'Enter address line 1'
  static readonly CONTENT_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly CITY_REQUIRED: string = 'Enter a valid city/town'
  static readonly POSTCODE_REQUIRED: string = 'Enter a postcode'
}

export class Address implements Serializable<Address> {

  @IsDefined({ message: ValidationErrors.FIRST_LINE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.FIRST_LINE_REQUIRED })
  @MaxLength(100, { message: ValidationErrors.CONTENT_TOO_LONG })
  line1?: string

  @MaxLength(100, { message: ValidationErrors.CONTENT_TOO_LONG })
  line2?: string

  @IsDefined({ message: ValidationErrors.CITY_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.CITY_REQUIRED })
  @MaxLength(60, { message: ValidationErrors.CONTENT_TOO_LONG })
  city?: string

  @IsDefined({ message: ValidationErrors.POSTCODE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.POSTCODE_REQUIRED })
  @MaxLength(8, { message: ValidationErrors.CONTENT_TOO_LONG })
  postcode?: string

  constructor (line1?: string, line2?: string, city?: string, postcode?: string) {
    this.line1 = line1
    this.line2 = line2
    this.city = city
    this.postcode = postcode
  }

  static fromObject (value?: any): Address {
    if (value != null) {
      const line1 = isUndefined(value.line1) ? undefined : value.line1.toUpperCase()
      const line2 = isUndefined(value.line2) ? undefined : value.line2.toUpperCase()
      const city = isUndefined(value.city) ? undefined : value.city.toUpperCase()
      const postcode = isUndefined(value.postcode) ? undefined : value.postcode.toUpperCase()
      return new Address(line1, line2, city, postcode)
    }

    return new Address()
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

  toString (): string {
    return this.line1 + ' ' + (this.line2 ? this.line2 + ' ' : '') + (this.city ? this.city + ' ' : '' ) + this.postcode
  }
}
