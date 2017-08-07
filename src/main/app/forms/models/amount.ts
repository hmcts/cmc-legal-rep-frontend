import * as _ from 'lodash'
import { IsDefined, IsEmpty, Max, Min, ValidateIf } from 'class-validator'
import { Fractions } from 'forms/validation/validators/fractions'
import { Serializable } from 'app/models/serializable'
import { IsLowerThan } from 'app/forms/validation/validators/isLowerThan'

export class ValidationErrors {
  static readonly VALID_SELECTION_REQUIRED: string = 'Enter a value or choose ‘I can’t state the value’'
  static readonly UPPER_VALUE_AMOUNT_NOT_VALID: string = 'Enter valid upper value'
  static readonly LOWER_VALUE_AMOUNT_NOT_VALID: string = 'Enter valid lower value'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter a maximum two decimal places'
}

export class Amount implements Serializable<Amount> {
  static readonly CANNOT_STATE_VALUE = 'cannot'

  @ValidateIf(o => o.upperValue && o.upperValue > 0)
  @IsEmpty({ message: ValidationErrors.VALID_SELECTION_REQUIRED })
  cannotState?: string

  @ValidateIf(o => o.cannotState !== Amount.CANNOT_STATE_VALUE)
  @ValidateIf(o => o.upperValue && o.upperValue > 0)
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  @IsLowerThan('upperValue', { message: ValidationErrors.LOWER_VALUE_AMOUNT_NOT_VALID })
  lowerValue?: number

  @ValidateIf(o => o.cannotState !== Amount.CANNOT_STATE_VALUE)
  @IsDefined({ message: ValidationErrors.VALID_SELECTION_REQUIRED })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0.01, { message: ValidationErrors.UPPER_VALUE_AMOUNT_NOT_VALID })
  @Max(99999.99, { message: ValidationErrors.UPPER_VALUE_AMOUNT_NOT_VALID })
  upperValue?: number

  constructor (lowerValue?: number, upperValue?: number, cannotState?: string) {
    this.lowerValue = lowerValue
    this.upperValue = upperValue
    this.cannotState = cannotState
  }

  static fromObject (value?: any): Amount {
    if (!value) {
      return new Amount()
    }

    const lowerValue = value.lowerValue ? _.toNumber(value.lowerValue.replace(',','')) : undefined
    const upperValue = value.upperValue ? _.toNumber(value.upperValue.replace(',','')) : undefined
    const cannotState = value.cannotState ? value.cannotState : undefined
    return new Amount(lowerValue, upperValue, cannotState)
  }

  deserialize (input?: any): Amount {
    if (input) {
      this.lowerValue = input.lowerValue
      this.upperValue = input.upperValue
      this.cannotState = input.cannotState
    }

    return this
  }
}
