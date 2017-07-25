import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'

@ValidatorConstraint()
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {

  validate (value?: any, args?: ValidationArguments): boolean {
    if (value == null) {
      return true
    }

    if (typeof value !== 'string') {
      return false
    }

    value = value.replace(/\(|\)| |-|\+/g, '').replace(/^(00)?44/, '').replace(/^0/, '').replace(/[^0-9.]/g, '')
    let firstChar = value.charAt(0)
    return firstChar <= '9' && firstChar > '0' && ( value.length === 10 || value.length === 9 || value.length === 7)
  }

}

/**
 * Verify a valid UK phone number.
 *
 * The validation is aligned to match what GOV.UK Notify is accepting.
 */
export function IsPhone (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint
    })
  }
}
