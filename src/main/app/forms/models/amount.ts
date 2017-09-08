import * as _ from 'lodash'
import { IsDefined, IsEmpty, IsNumber, IsOptional, Max, Min, ValidateIf } from 'class-validator'
import { Fractions } from 'forms/validation/validators/fractions'
import { Serializable } from 'app/models/serializable'
import { IsLowerThan } from 'app/forms/validation/validators/isLowerThan'

export class ValidationErrors {
  static readonly CANNOT_STATE_VALID_SELECTION_REQUIRED: string = 'Choose ‘I can’t state the value’ or enter a higher value'
  static readonly VALID_SELECTION_REQUIRED: string = 'Enter a higher value or choose ‘I can’t state the value’'
  static readonly HIGHER_VALUE_AMOUNT_NOT_VALID: string = 'Enter valid higher value'
  static readonly LOWER_VALUE_AMOUNT_NOT_VALID: string = 'Enter valid lower value'
  static readonly LOWER_VALUE_LESS_THAN_UPPER_NOT_VALID: string = 'Lower value must be less than higher value'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Use maximum two decimal places'
}

export class Amount implements Serializable<Amount> {
  static readonly CANNOT_STATE_VALUE = 'cannot'
  static readonly MAX_ALLOWED = 9999999.99

  @ValidateIf(o => (o.higherValue && o.higherValue > 0 ) || (o.lowerValue && o.lowerValue > 0))
  @IsEmpty({ message: ValidationErrors.CANNOT_STATE_VALID_SELECTION_REQUIRED })
  cannotState?: string

  @ValidateIf(o => o.cannotState !== Amount.CANNOT_STATE_VALUE)
  @IsOptional()
  @IsNumber({ message: ValidationErrors.LOWER_VALUE_AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0.01, { message: ValidationErrors.LOWER_VALUE_AMOUNT_NOT_VALID })
  @IsLowerThan('higherValue', { message: ValidationErrors.LOWER_VALUE_LESS_THAN_UPPER_NOT_VALID })
  lowerValue?: number

  @ValidateIf(o => o.cannotState !== Amount.CANNOT_STATE_VALUE)
  @IsDefined({ message: ValidationErrors.VALID_SELECTION_REQUIRED })
  @IsNumber({ message: ValidationErrors.HIGHER_VALUE_AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0.01, { message: ValidationErrors.HIGHER_VALUE_AMOUNT_NOT_VALID })
  @Max(Amount.MAX_ALLOWED, { message: ValidationErrors.HIGHER_VALUE_AMOUNT_NOT_VALID })
  higherValue?: number

  constructor (lowerValue?: any, higherValue?: any, cannotState?: string) {
    this.lowerValue = lowerValue
    this.higherValue = higherValue
    this.cannotState = cannotState
  }

  static translateToNumber (input?: any): any {
    const numberValue = _.toNumber(input)
    const isExponential = numberValue.toString().match(new RegExp('\\d*[Ee][+-]?\\d*?'))

    if (!isNaN(numberValue) && !isExponential) {
      return numberValue
    } else {
      return input
    }
  }

  static fromObject (value?: any): Amount {
    if (!value) {
      return new Amount()
    }

    // change to undefined after class-validator version > 0.7.2 is released
    const lowerValue = value.lowerValue ? Amount.translateToNumber(value.lowerValue.replace(new RegExp(/,/g), '')) : null
    const higherValue = value.higherValue ? Amount.translateToNumber(value.higherValue.replace(new RegExp(/,/g), '')) : undefined
    const cannotState = value.cannotState ? value.cannotState : undefined

    return new Amount(lowerValue, higherValue, cannotState)
  }

  deserialize (input?: any): Amount {
    if (input) {
      this.lowerValue = input.lowerValue
      this.higherValue = input.higherValue
      this.cannotState = input.cannotState
    }

    return this
  }

  canNotState (): boolean {
    return this.cannotState === Amount.CANNOT_STATE_VALUE
  }

}
