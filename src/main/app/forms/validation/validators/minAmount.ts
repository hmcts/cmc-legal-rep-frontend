import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'minAmount' })
export class MinAmountConstraint implements ValidatorConstraintInterface {

  validate (value: any, args: ValidationArguments) {

    const min: number = args.constraints[0]
    const cannotStateInput = (args.object as any)[args.constraints[1]]

    if (cannotStateInput === 'cannot' && (value === null || value === undefined)) {
      return true
    }

    return value >= min
  }
}

export function MinAmount (min: number, cannotState: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [min, cannotState],
      validator: MinAmountConstraint
    })
  }
}
