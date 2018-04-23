import { IsDefined, MaxLength } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isNotBlank'

import { Serializable } from 'models/serializable'
import { isUndefined } from 'util'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { IsValidPostcode } from 'forms/validation/validators/isValidPostcode'

export class Address implements Serializable<Address> {

  @IsDefined({ message: CommonValidationErrors.FIRST_LINE_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.FIRST_LINE_REQUIRED })
  @MaxLength(100, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  line1?: string

  @MaxLength(100, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  line2?: string

  @IsDefined({ message: CommonValidationErrors.CITY_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.CITY_REQUIRED })
  @MaxLength(60, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  city?: string

  @IsDefined({ message: CommonValidationErrors.POSTCODE_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.POSTCODE_REQUIRED })
  @IsValidPostcode({ message: CommonValidationErrors.POSTCODE_INVALID })
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
    return this.line1 + ' ' + (this.line2 ? this.line2 + ' ' : '') + (this.city ? this.city + ' ' : '') + this.postcode
  }
}
