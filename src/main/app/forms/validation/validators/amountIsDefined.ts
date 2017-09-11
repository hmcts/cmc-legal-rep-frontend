import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'amountIsDefined' })
export class AmountIsDefinedConstraint implements ValidatorConstraintInterface {

  validate (value: any, args: ValidationArguments) {
    const cannotStateInput = (args.object as any)[args.constraints[0]]

    if (cannotStateInput === 'cannot' && (value === undefined || value === null || isNaN(value))) {
      return true
    }

    return value != null
  }
}

export function AmountIsDefined (cannotState: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [cannotState],
      validator: AmountIsDefinedConstraint
    })
  }
}
