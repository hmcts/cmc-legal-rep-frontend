import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'isAmountRangeDefined' })
export class IsAmountRangeDefinedConstraint implements ValidatorConstraintInterface {

  validate (value: any, args: ValidationArguments) {
    const cannotStateInput = (args.object as any)[args.constraints[0]]

    if (cannotStateInput === 'cannot' && (value === undefined || value === null || isNaN(value))) {
      return true
    }

    return value != null
  }
}

/**
 * Validator validates only amount range value for defined when cannot state is not selected.
 */
export function IsAmountRangeDefined (cannotState: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [cannotState],
      validator: IsAmountRangeDefinedConstraint
    })
  }
}
