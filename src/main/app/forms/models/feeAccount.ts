import { Serializable } from 'models/serializable'
import { IsFeeAccount } from 'app/forms/validation/validators/isFeeAccount'
import { IsDefined } from 'class-validator'
import { IsNotBlank } from 'app/forms/validation/validators/isNotBlank'

export class ValidationErrors {
  static readonly FEE_ACCOUNT_INVALID: string = 'Enter a valid Fee Account number'
  static readonly FEE_ACCOUNT_REQUIRED: string = 'Enter your Fee Account number'
}

export class FeeAccount implements Serializable<FeeAccount> {

  @IsDefined({ message: ValidationErrors.FEE_ACCOUNT_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.FEE_ACCOUNT_REQUIRED })
  @IsFeeAccount({ message: ValidationErrors.FEE_ACCOUNT_INVALID })
  reference?: string

  constructor (reference?: string) {
    this.reference = reference
  }

  static fromObject (value?: any): FeeAccount {
    if (value == null) {
      return value
    }
    return new FeeAccount(FeeAccount.toUpperCase(value.reference.trim()))
  }

  static toUpperCase (value: any): string {
    return value ? value.toUpperCase() : value
  }

  deserialize (input?: any): FeeAccount {
    if (input) {
      this.reference = input.reference
    }

    return this
  }
}
