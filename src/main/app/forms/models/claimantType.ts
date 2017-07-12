import { IsDefined } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose a claimant type'
}

export class ClaimantType implements Serializable<ClaimantType> {

  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  type?: string

  constructor (type?: string) {
    this.type = type
  }

  static fromObject (value?: any): ClaimantType {
    if (value == null) {
      return value
    }

    const instance = new ClaimantType(value.type)

    return instance
  }

  deserialize (input?: any): ClaimantType {
    if (input) {
      this.type = input.type
    }
    return this
  }
}
