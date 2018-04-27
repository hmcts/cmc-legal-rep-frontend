import { IsDefined, IsIn, MaxLength, ValidateIf } from 'class-validator'
import { Serializable } from 'models/serializable'
import { YesNo } from 'forms/models/yesNo'
import { IsNotBlank } from 'forms/validation/validators/isNotBlank'
import { isUndefined } from 'util'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly DEFENDANT_SERVICE_ADDRESS_REQUIRED: string = 'Choose which address to use'
}

export class ServiceAddress implements Serializable<ServiceAddress> {

  @IsDefined({ message: ValidationErrors.DEFENDANT_SERVICE_ADDRESS_REQUIRED })
  @IsIn(YesNo.all(), { message: ValidationErrors.DEFENDANT_SERVICE_ADDRESS_REQUIRED })
  defendantsAddress?: YesNo

  @ValidateIf(o => o.defendantsAddress === YesNo.NO)
  @IsDefined({ message: CommonValidationErrors.FIRST_LINE_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.FIRST_LINE_REQUIRED })
  @MaxLength(100, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  line1?: string

  @ValidateIf(o => o.defendantsAddress === YesNo.NO)
  @MaxLength(100, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  line2?: string

  @ValidateIf(o => o.defendantsAddress === YesNo.NO)
  @IsDefined({ message: CommonValidationErrors.CITY_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.CITY_REQUIRED })
  @MaxLength(60, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  city?: string

  @ValidateIf(o => o.defendantsAddress === YesNo.NO)
  @IsDefined({ message: CommonValidationErrors.POSTCODE_REQUIRED })
  @IsNotBlank({ message: CommonValidationErrors.POSTCODE_REQUIRED })
  @MaxLength(8, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  postcode?: string

  constructor (defendantsAddress?: YesNo, line1?: string, line2?: string, city?: string, postcode?: string) {
    this.defendantsAddress = defendantsAddress
    this.line1 = line1
    this.line2 = line2
    this.city = city
    this.postcode = postcode
  }

  static fromObject (value?: any): ServiceAddress {
    if (value != null) {
      let defendantsAddress

      if (value.defendantsAddress) {
        defendantsAddress = YesNo.all()
          .filter(yesNo => yesNo.value === value.defendantsAddress)
          .pop()
      }

      const line1 = isUndefined(value.line1) ? undefined : value.line1.toUpperCase()
      const line2 = isUndefined(value.line2) ? undefined : value.line2.toUpperCase()
      const city = isUndefined(value.city) ? undefined : value.city.toUpperCase()
      const postcode = isUndefined(value.postcode) ? undefined : value.postcode.toUpperCase()
      return new ServiceAddress(defendantsAddress, line1, line2, city, postcode)
    }

    return new ServiceAddress()
  }

  deserialize (input?: any): ServiceAddress {
    if (input) {
      this.defendantsAddress = input.defendantsAddress
      this.line1 = input.line1
      this.line2 = input.line2
      this.city = input.city
      this.postcode = input.postcode
    }
    return this
  }
}
