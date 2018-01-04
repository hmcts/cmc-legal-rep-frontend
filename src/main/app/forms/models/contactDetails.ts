import { Serializable } from 'app/models/serializable'
import { IsOptional, MaxLength } from 'class-validator'
import { IsEmail } from 'app/forms/validation/validators/isEmail'
import { IsPhone } from 'app/forms/validation/validators/phone'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ContactDetails implements Serializable<ContactDetails> {

  @IsOptional()
  @IsPhone({ message: CommonValidationErrors.PHONE_NUMBER_NOT_VALID })
  phoneNumber?: string

  @IsOptional()
  @IsEmail({ message: CommonValidationErrors.EMAIL_NOT_VALID })
  email?: string

  @IsOptional()
  @MaxLength(255, { message: CommonValidationErrors.DX_ADDRESS_TOO_LONG })
  dxAddress?: string

  constructor (phoneNumber?: string, email?: string, dxAddress?: string) {
    this.phoneNumber = phoneNumber
    this.email = email
    this.dxAddress = dxAddress
  }

  static fromObject (value?: any): ContactDetails {
    if (value != null) {
      value.phoneNumber = value.phoneNumber === '' ? undefined : value.phoneNumber
      value.email = value.email === '' ? undefined : value.email
      return new ContactDetails(value.phoneNumber, value.email, value.dxAddress)
    }

    return new ContactDetails()
  }

  deserialize (input?: any): ContactDetails {
    if (input) {
      if (input.phoneNumber) {
        this.phoneNumber = input.phoneNumber
      }
      if (input.email) {
        this.email = input.email
      }
      if (input.dxAddress) {
        this.dxAddress = input.dxAddress
      }
    }

    return this
  }

}
