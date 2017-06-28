import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

import * as moment from 'moment'
import { LocalDate } from 'forms/models/localDate'

@ValidatorConstraint()
export class DateNotInFutureConstraint implements ValidatorConstraintInterface {
  validate (value: any, args?: ValidationArguments) {
    if (value == null) {
      return true
    }

    if (!(value instanceof LocalDate)) {
      return false
    }

    const date = value.toMoment()
    const now = moment()

    return date.isBefore(now)
  }
}

export function IsNotInFuture (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DateNotInFutureConstraint
    })
  }
}
