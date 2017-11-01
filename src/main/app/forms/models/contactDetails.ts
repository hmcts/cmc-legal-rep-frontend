import { Serializable } from 'app/models/serializable'
import { IsOptional, MaxLength } from 'class-validator'
import { IsEmail } from 'app/forms/validation/validators/isEmail'
import { IsPhone } from 'app/forms/validation/validators/phone'

export class ValidationErrors {
  static readonly EMAIL_NOT_VALID: string = 'Enter a valid email address'
  static readonly DX_ADDRESS_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly PHONE_NUMBER_NOT_VALID: string = 'Enter a valid phone number'
}

export class ContactDetails implements Serializable<ContactDetails> {

  @IsOptional()
  @IsPhone({ message: ValidationErrors.PHONE_NUMBER_NOT_VALID })
  phoneNumber?: string

  @IsOptional()
  @IsEmail({ message: ValidationErrors.EMAIL_NOT_VALID })
  email?: string

  @IsOptional()
  @MaxLength(255, { message: ValidationErrors.DX_ADDRESS_TOO_LONG })
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
