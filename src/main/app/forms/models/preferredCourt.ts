import { IsOptional, MaxLength } from '@hmcts/class-validator'
import { Serializable } from 'models/serializable'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export default class PreferredCourt implements Serializable<PreferredCourt> {

  @MaxLength(80, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  @IsOptional()
  name?: string

  constructor (name?: string) {
    this.name = name
  }

  static fromObject (value?: any): PreferredCourt {
    if (value != null) {
      return new PreferredCourt(value.name)
    }

    return new PreferredCourt()
  }

  deserialize (input: any): PreferredCourt {
    if (input) {
      this.name = input.name
    }
    return this
  }
}
