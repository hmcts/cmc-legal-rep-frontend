import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@hmcts/class-validator'

@ValidatorConstraint({ name: 'minAmountRange' })
export class MinAmountRangeConstraint implements ValidatorConstraintInterface {

  validate (value: any, args: ValidationArguments) {

    const min: number = args.constraints[0]
    const cannotStateInput = (args.object as any)[args.constraints[1]]

    if (cannotStateInput === 'cannot' && (value === null || value === undefined)) {
      return true
    }

    return value >= min
  }
}

/**
 * Validator validates only amount range value for minimum when cannot state is not selected.
 */
export function MinAmountRange (min: number, cannotState: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [min, cannotState],
      validator: MinAmountRangeConstraint
    })
  }
}
