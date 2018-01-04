import { IsDefined, IsIn, ValidateIf, MaxLength } from 'class-validator'
import { IsNotBlank } from 'app/forms/validation/validators/isNotBlank'
import { Serializable } from 'models/serializable'
import { ServiceMethod } from 'forms/models/ServiceMethod'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly SERVICE_METHOD_REQUIRED: string = 'Choose how you served the defendant'
  static readonly OTHER_REQUIRED: string = 'Please enter the other means by which you sent the documents'
}

export class HowDidYouServe implements Serializable<HowDidYouServe> {

  @IsDefined({ message: ValidationErrors.SERVICE_METHOD_REQUIRED })
  @IsIn(ServiceMethod.all(), { message: ValidationErrors.SERVICE_METHOD_REQUIRED })
  serviceMethod?: ServiceMethod

  @ValidateIf(o => o.serviceMethod === ServiceMethod.OTHER_ELECTRONIC)
  @IsDefined({ message: ValidationErrors.OTHER_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.OTHER_REQUIRED })
  @MaxLength(70, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  otherElectronic?: string

  @ValidateIf(o => o.serviceMethod === ServiceMethod.OTHER)
  @IsDefined({ message: ValidationErrors.OTHER_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.OTHER_REQUIRED })
  @MaxLength(70, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  other?: string

  constructor (serviceMethod?: ServiceMethod, otherElectronic?: string, other?: string) {
    this.serviceMethod = serviceMethod
    this.otherElectronic = otherElectronic
    this.other = other
  }

  static fromObject (value?: any): HowDidYouServe {
    let serviceMethodValue

    if (value && value.serviceMethod) {
      serviceMethodValue = ServiceMethod.all()
        .filter(serviceMethod => serviceMethod.value === value.serviceMethod)
        .pop()

      return new HowDidYouServe(serviceMethodValue, value.otherElectronic, value.other)
    } else {
      return new HowDidYouServe()
    }
  }

  deserialize (input?: any): HowDidYouServe {
    if (input) {
      this.serviceMethod = input.serviceMethod
      this.otherElectronic = input.otherElectronic
      this.other = input.other
    }
    return this
  }
}
