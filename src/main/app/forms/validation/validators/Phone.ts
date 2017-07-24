import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'

import * as validator from 'validator'

@ValidatorConstraint()
export class IsPhoneConstraint implements ValidatorConstraintInterface {

  validate (value?: any, args?: ValidationArguments): boolean {
    if (value == null) {
      return true
    }

    if (typeof value !== 'string') {
      return false
    }

    value = value.replace(/\(|\)| |-|\+/g, '').replace(/^(00)?44/, '').replace(/^0/, '')
    return validator.isMobilePhone(value, 'en-GB') || value.length === 10 || value.length === 9 || value.length === 7
  }

}

/**
 * Verify a valid UK mobile number.
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
      validator: IsPhoneConstraint
    })
  }
}
