import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from '@hmcts/class-validator'

@ValidatorConstraint({ name: 'isSelectedAlong' })
export class IsSelectedAlongConstraint implements ValidatorConstraintInterface {

  validate (value: any, args: ValidationArguments) {

    const cannotState = (args.object as any)[args.constraints[0]]
    const lowerValue = (args.object as any)[args.constraints[1]]

    if (cannotState !== 'cannot') {
      return true
    }

    return (lowerValue === null || lowerValue === undefined) && (value === null || value === undefined)
  }
}

export function IsSelectedAlong (cannotState: string, lowerValue: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [cannotState, lowerValue],
      validator: IsSelectedAlongConstraint
    })
  }
}
