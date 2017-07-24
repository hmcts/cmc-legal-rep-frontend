import { IsDefined, MaxLength } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { ContactDetails } from 'app/forms/models/contactDetails'

export class ValidationErrors {
  static readonly REPRESENTATIVE_NAME_REQUIRED: string = 'Enter your company name'
  static readonly REPRESENTATIVE_NAME_TOO_LONG: string = 'You’ve entered too many characters'
}

export default class Representative implements Serializable<Representative> {

  @IsDefined({ message: ValidationErrors.REPRESENTATIVE_NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REPRESENTATIVE_NAME_REQUIRED })
  @MaxLength(255, { message: ValidationErrors.REPRESENTATIVE_NAME_TOO_LONG })
  name?: string

  contactDetails?: ContactDetails

  constructor (name?: string, contactDetails?: ContactDetails) {
    this.name = name
    this.contactDetails = contactDetails
  }

  static fromObject (value?: any): Representative {
    if (value != null) {
      return new Representative(value.name, new ContactDetails().deserialize(value.contactDetails))
    }

    return value
  }

  deserialize (input?: any): Representative {
    if (input) {
      this.name = input.name
      this.contactDetails = input.contactDetails
    }
    return this
  }
}
