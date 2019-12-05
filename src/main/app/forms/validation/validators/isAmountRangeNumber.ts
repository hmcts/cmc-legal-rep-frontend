import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@hmcts/class-validator'

@ValidatorConstraint({ name: 'isAmountRangeNumber' })
export class IsAmountRangeNumberConstraint implements ValidatorConstraintInterface {

  validate (value: any, args: ValidationArguments) {
    const cannotStateInput = (args.object as any)[args.constraints[0]]

    if (cannotStateInput === 'cannot' && (value === null || value === undefined)) {
      return true
    }

    return typeof value === 'number'
  }
}

/**
 * Validator validates only amount range value for number when cannot state is not selected.
 */
export function IsAmountRangeNumber (cannotState: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [cannotState],
      validator: IsAmountRangeNumberConstraint
    })
  }
}
