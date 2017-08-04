import * as _ from 'lodash'
import { IsDefined, Max, Min, ValidateIf, Contains } from 'class-validator'
import { Fractions } from 'forms/validation/validators/fractions'
import { Serializable } from 'app/models/serializable'

export class ValidationErrors {
  static readonly UPPER_VALUE_REQUIRED: string = 'Enter a value or choose ‘I can’t state the value’'
  static readonly UPPER_VALUE_AMOUNT_NOT_VALID: string = 'Enter valid upper value'
  static readonly LOWER_VALUE_AMOUNT_NOT_VALID: string = 'Enter valid lower value'
  static readonly PICK_ONLY_ONE_OPTION: string = 'You have stated an upper value'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter a maximum two decimal places'
}

export class Amount implements Serializable<Amount> {
  static readonly CANNOT_STATE_VALUE = 'cannot'

  @ValidateIf(o => o.upperValue !== undefined)
  @Contains(Amount.CANNOT_STATE_VALUE, { message: ValidationErrors.PICK_ONLY_ONE_OPTION})
  cannotState?: string

  @ValidateIf(o => o.cannotState !== Amount.CANNOT_STATE_VALUE)
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  lowerValue?: number

  @ValidateIf(o => o.cannotState !== Amount.CANNOT_STATE_VALUE)
  @IsDefined({ message: ValidationErrors.UPPER_VALUE_REQUIRED })
  @Min(0.01, { message: ValidationErrors.UPPER_VALUE_AMOUNT_NOT_VALID })
  @Max(99999.99, { message: ValidationErrors.UPPER_VALUE_AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
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

    const lowerValue = value.lowerValue ? _.toNumber(value.lowerValue) : undefined
    const upperValue = value.upperValue ? _.toNumber(value.upperValue) : undefined
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
