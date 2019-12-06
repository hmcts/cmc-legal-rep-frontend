import { Max, Min } from '@hmcts/class-validator'
import * as _ from 'lodash'
import * as moment from 'moment'

import { Serializable } from 'models/serializable'
import leftPad = require('left-pad')

export class ValidationErrors {
  static readonly YEAR_NOT_VALID: string = 'Enter a valid year'
  static readonly MONTH_NOT_VALID: string = 'Enter a valid month'
  static readonly DAY_NOT_VALID: string = 'Enter a valid day'
}

export class LocalDate implements Serializable<LocalDate> {

  @Min(1, { message: ValidationErrors.YEAR_NOT_VALID })
  @Max(9999, { message: ValidationErrors.YEAR_NOT_VALID })
  year: number
  @Min(1, { message: ValidationErrors.MONTH_NOT_VALID })
  @Max(12, { message: ValidationErrors.MONTH_NOT_VALID })
  month: number
  @Min(1, { message: ValidationErrors.DAY_NOT_VALID })
  @Max(31, { message: ValidationErrors.DAY_NOT_VALID })
  day: number

  constructor (year?: number, month?: number, day?: number) {
    this.year = year
    this.month = month
    this.day = day
  }

  static fromObject (value?: any): LocalDate {
    if (!value) {
      return value
    }

    const instance = new LocalDate();
    ['year', 'month', 'day'].forEach((field: string) => {
      if (value[field]) {
        instance[field] = _.toNumber(value[field])
      }
    })
    return instance
  }

  deserialize (input?: any): LocalDate {
    if (input) {
      this.day = input.day
      this.month = input.month
      this.year = input.year
    }
    return this
  }

  toMoment (): moment.Moment {
    return moment(this.asString())
  }

  asString (): string {
    // Because we instantiate an empty object instead of doing this properly we can get undefined values here
    // This is stupid, loose models being used for validation and being the actual model
    if (!this.day || !this.month || !this.year) {
      return ''
    } else {
      return `${this.year}-${leftPad(this.month, 2, 0)}-${leftPad(this.day, 2, 0)}`
    }
  }
}
