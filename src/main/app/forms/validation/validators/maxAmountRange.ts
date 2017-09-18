import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'maxAmountRange' })
export class MaxAmountRangeConstraint implements ValidatorConstraintInterface {

  validate (value: any, args: ValidationArguments) {

    const max: number = args.constraints[0]
    const cannotStateInput = (args.object as any)[args.constraints[1]]

    if (cannotStateInput === 'cannot' && (value === null || value === undefined )) {
      return true
    }

    return value <= max
  }
}

/**
 * Validator validates only amount range value for maximum when cannot state is not selected.
 */
export function MaxRangeAmount (max: number, cannotState: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [max, cannotState],
      validator: MaxAmountRangeConstraint
    })
  }
}
