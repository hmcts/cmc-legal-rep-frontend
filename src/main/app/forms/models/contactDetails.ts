import { Serializable } from 'app/models/serializable'
import { IsDefined, IsOptional, MaxLength } from 'class-validator'
import { IsEmail } from 'app/forms/validation/validators/isEmail'
import { IsPhone } from 'app/forms/validation/validators/phone'

export class ValidationErrors {
  static readonly ADDRESS_NOT_VALID: string = 'Enter valid email address'
  static readonly ADDRESS_REQUIRED: string = 'Enter email address'
  static readonly NUMBER_REQUIRED: string = 'Enter UK mobile number'
  static readonly YOUR_DX_ADDRESS_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly NUMBER_NOT_VALID: string = 'Enter valid UK phone number'
}

export class ContactDetails implements Serializable<ContactDetails> {

  @IsDefined({ message: ValidationErrors.NUMBER_REQUIRED })
  @IsPhone({ message: ValidationErrors.NUMBER_NOT_VALID })
  phoneNumber?: string

  @IsDefined({ message: ValidationErrors.ADDRESS_REQUIRED })
  @IsEmail({ message: ValidationErrors.ADDRESS_NOT_VALID })
  email?: string

  @IsOptional()
  @MaxLength(255, { message: ValidationErrors.YOUR_DX_ADDRESS_TOO_LONG })
  dxAddress?: string = ''

  constructor (phoneNumber?: string, email?: string, dxAddress?: string) {
    this.phoneNumber = phoneNumber
    this.email = email
    this.dxAddress = dxAddress
  }

  static fromObject (value?: any): ContactDetails {
    if (value != null) {
      return new ContactDetails(value.phoneNumber, value.email, value.dxAddress)
    }

    return new ContactDetails()
  }

  deserialize (input?: any): ContactDetails {
    if (input) {
      this.phoneNumber = input.number
      this.email = input.email
      this.dxAddress = input.dxAddress
    }

    return this
  }

}
