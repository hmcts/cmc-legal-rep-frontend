import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'isLongerThan' })
export class IsLowerThanConstraint implements ValidatorConstraintInterface {

  validate (value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as any)[relatedPropertyName]

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
