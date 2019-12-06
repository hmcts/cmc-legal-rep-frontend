import { IsDefined, Matches } from '@hmcts/class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from '@hmcts/cmc-validators'

export class ValidationErrors {
  static readonly REFERENCE_REQUIRED: string = 'Enter your claim number'
  static readonly CLAIM_REFERENCE_INVALID: string = 'You need to enter a valid claim number'
}

export class Search implements Serializable<Search> {

  @IsDefined({ message: ValidationErrors.REFERENCE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REFERENCE_REQUIRED })
  @Matches(new RegExp('^\\d{3}LR\\d{3}$'), { message: ValidationErrors.CLAIM_REFERENCE_INVALID })
  reference?: string

  constructor (reference?: string) {
    this.reference = reference ? reference.trim().toUpperCase() : undefined
  }

  static fromObject (value?: any): Search {
    if (value == null) {
      return value
    }
    const reference = value.reference === undefined ? undefined : value.reference.trim().toUpperCase()
    return new Search(reference)
  }

  deserialize (input?: any): Search {
    if (input) {
      this.reference = input.reference
    }
    return this
  }
}
