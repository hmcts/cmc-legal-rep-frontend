import * as _ from 'lodash'
import { IsDefined, Max, Min } from 'class-validator'
import { Fractions } from 'forms/validation/validators/fractions'
import { Serializable } from 'app/models/serializable'

export class ValidationErrors {
  static readonly UPPER_VALUE_REQUIRED: string = 'Enter amount'
  static readonly AMOUNT_NOT_VALID: string = 'Enter valid amount'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter valid amount, maximum two decimal places'
}

export default class Amount implements Serializable<Amount> {
  cannotState?: string

  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  lowerValue?: number

  @IsDefined({ message: ValidationErrors.UPPER_VALUE_REQUIRED })
  @Min(0.01, { message: ValidationErrors.AMOUNT_NOT_VALID })
  @Max(99999.99, { message: ValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  upperValue?: number

  constructor (lowerValue?: number, upperValue?: number, reason?: string) {
    this.lowerValue = lowerValue
    this.upperValue = upperValue
    this.cannotState = reason
  }

  static empty (): Amount {
    return new Amount(undefined, undefined, undefined)
  }

  static fromObject (value?: any): Amount {
    if (!value) {
      return value
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
      this.cannotState = input.reason
    }

    return this
  }
}
