import { IsDefined, IsIn, MaxLength, ValidateIf } from 'class-validator'
import { Serializable } from 'models/serializable'
import { YesNo } from 'forms/models/yesNo'
import { IsNotBlank } from 'app/forms/validation/validators/isNotBlank'
import StringUtils from 'utils/stringUtils'

export class ValidationErrors {
  static readonly DEFENDANT_SERVICE_ADDRESS_REQUIRED: string = 'Choose which address to use'
  static readonly FIRST_LINE_REQUIRED: string = 'Enter address line 1'
  static readonly CONTENT_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly CITY_REQUIRED: string = 'Enter a valid city/town'
  static readonly POSTCODE_REQUIRED: string = 'Enter a postcode'
}

export class ServiceAddress implements Serializable<ServiceAddress> {

  @IsDefined({ message: ValidationErrors.DEFENDANT_SERVICE_ADDRESS_REQUIRED })
  @IsIn(YesNo.all(), { message: ValidationErrors.DEFENDANT_SERVICE_ADDRESS_REQUIRED })
  defendantsAddress?: YesNo

  @ValidateIf(o => o.defendantsAddress === YesNo.NO)
  @IsDefined({ message: ValidationErrors.FIRST_LINE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.FIRST_LINE_REQUIRED })
  @MaxLength(100, { message: ValidationErrors.CONTENT_TOO_LONG })
  line1?: string

  @ValidateIf(o => o.defendantsAddress === YesNo.NO)
  @MaxLength(100, { message: ValidationErrors.CONTENT_TOO_LONG })
  line2?: string

  @ValidateIf(o => o.defendantsAddress === YesNo.NO)
  @IsDefined({ message: ValidationErrors.CITY_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.CITY_REQUIRED })
  @MaxLength(60, { message: ValidationErrors.CONTENT_TOO_LONG })
  city?: string

  @ValidateIf(o => o.defendantsAddress === YesNo.NO)
  @IsDefined({ message: ValidationErrors.POSTCODE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.POSTCODE_REQUIRED })
  @MaxLength(8, { message: ValidationErrors.CONTENT_TOO_LONG })
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

      const line1 = StringUtils.toUpperCase(value.line1)
      const line2 = StringUtils.toUpperCase(value.line2)
      const city = StringUtils.toUpperCase(value.city)
      const postcode = StringUtils.toUpperCase(value.postcode)
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
