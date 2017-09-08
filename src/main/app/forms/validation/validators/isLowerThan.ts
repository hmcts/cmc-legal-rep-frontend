import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'isLowerThan' })
export class IsLowerThanConstraint implements ValidatorConstraintInterface {

  validate (value: any, args: ValidationArguments) {
    if (value == null) {
      return true
    }

    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as any)[relatedPropertyName]

    if (isNaN(relatedValue)) {
      return true
    }

    if (typeof relatedValue !== 'number') {
      return true
    }

    return typeof value === 'number' &&
      typeof relatedValue === 'number' &&
      value <= relatedValue
  }
}

export function IsLowerThan (property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsLowerThanConstraint
    })
  }
}
