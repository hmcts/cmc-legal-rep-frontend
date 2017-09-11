import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'amountIsNumber' })
export class AmountIsNumberConstraint implements ValidatorConstraintInterface {

  validate (value: any, args: ValidationArguments) {
    const cannotStateInput = (args.object as any)[args.constraints[0]]

    if (cannotStateInput === 'cannot' && (value === null || value === undefined)) {
      return true
    }

    return typeof value === 'number'
  }
}

export function AmountIsNumber (cannotState: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [cannotState],
      validator: AmountIsNumberConstraint
    })
  }
}
