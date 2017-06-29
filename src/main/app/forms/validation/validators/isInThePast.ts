import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import moment = require('moment')

import { LocalDate } from 'forms/models/localDate'

@ValidatorConstraint()
export class IsInThePastConstraint implements ValidatorConstraintInterface {

  validate (value: any | LocalDate, args?: ValidationArguments): boolean {
    const [yearsAgo] = args.constraints
    if (!yearsAgo || yearsAgo <= 0) {
      throw new Error('Distance in the past has to be specified')
    }

    if (value == null) {
      return true
    }

    if (!(value instanceof LocalDate)) {
      return false
    }

    const today = moment()
    const date = value.toMoment()

    return today.diff(date, 'years') >= yearsAgo
  }

}

/**
 * Verify date is in the past
 */
export function IsInThePast (yearsAgo: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [yearsAgo],
      validator: IsInThePastConstraint
    })
  }
}
