import * as _ from 'lodash'
import { IsEmpty, IsNumber, IsOptional, Min, ValidateIf } from 'class-validator'
import { Fractions } from 'forms/validation/validators/fractions'
import { Serializable } from 'app/models/serializable'
import { IsLowerThan } from 'app/forms/validation/validators/isLowerThan'
import { IsSelectedAlong } from 'app/forms/validation/validators/isSelectedAlong'
import { MinAmountRange } from 'app/forms/validation/validators/minAmountRange'
import { MaxRangeAmount } from 'app/forms/validation/validators/maxAmountRange'
import { IsAmountRangeNumber } from 'app/forms/validation/validators/isAmountRangeNumber'
import { IsAmountRangeDefined } from 'app/forms/validation/validators/isAmountRangeDefined'

export class ValidationErrors {
  static readonly CANNOT_STATE_VALID_SELECTION_REQUIRED: string = 'Choose ‘I can’t state the value’ or enter a higher value'
  static readonly VALID_SELECTION_REQUIRED: string = 'Enter a higher value or choose ‘I can’t or don't want to state the value’'
  static readonly HIGHER_VALUE_AMOUNT_NOT_VALID: string = 'Enter valid higher value'
  static readonly LOWER_VALUE_AMOUNT_NOT_VALID: string = 'Enter valid lower value'
  static readonly LOWER_VALUE_LESS_THAN_UPPER_NOT_VALID: string = 'Lower value must be less than higher value'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Use maximum two decimal places'
}

export class Amount implements Serializable<Amount> {
  static readonly CANNOT_STATE_VALUE = 'cannot'
  static readonly MAX_ALLOWED = 9999999.99
  static readonly MIN_ALLOWED = 0.01

  @ValidateIf(o => (o.higherValue != null) || (o.lowerValue != null))
  @IsEmpty({ message: ValidationErrors.CANNOT_STATE_VALID_SELECTION_REQUIRED })
  cannotState?: string

  @IsOptional()
  @IsNumber({ message: ValidationErrors.LOWER_VALUE_AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(Amount.MIN_ALLOWED, { message: ValidationErrors.LOWER_VALUE_AMOUNT_NOT_VALID })
  @IsLowerThan('higherValue', { message: ValidationErrors.LOWER_VALUE_LESS_THAN_UPPER_NOT_VALID })
  lowerValue?: number

  @IsAmountRangeDefined('cannotState', { message: ValidationErrors.VALID_SELECTION_REQUIRED })
  @IsAmountRangeNumber('cannotState', { message: ValidationErrors.HIGHER_VALUE_AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  @MinAmountRange(Amount.MIN_ALLOWED, 'cannotState', { message: ValidationErrors.HIGHER_VALUE_AMOUNT_NOT_VALID })
  @MaxRangeAmount(Amount.MAX_ALLOWED, 'cannotState', { message: ValidationErrors.HIGHER_VALUE_AMOUNT_NOT_VALID })
  @IsSelectedAlong('cannotState', 'lowerValue', { message: ValidationErrors.VALID_SELECTION_REQUIRED })
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
