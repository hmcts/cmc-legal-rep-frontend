import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'

@ValidatorConstraint()
export class IsFeeAccountConstraint implements ValidatorConstraintInterface {

  validate (value?: any, args?: ValidationArguments): boolean {
    if (value == null) {
      return true
    }

    if (typeof value !== 'string') {
      return false
    }

    const feeAccountRule: RegExp = new RegExp(/^PBA[0-9]{7}$/g)
    return feeAccountRule.test(value)
  }

}

/**
 * Verify a valid fee account number.*
 */
export function IsFeeAccount (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFeeAccountConstraint
    })
  }
}
