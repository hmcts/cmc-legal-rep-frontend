import { IsDefined, MaxLength } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'

import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly SIGNER_NAME_REQUIRED: string = 'Enter the name of the person signing the statement'
  static readonly CONTENT_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly SIGNER_ROLE_REQUIRED: string = 'Enter the role of the person signing the statement'
}

export class StatementOfTruth implements Serializable<StatementOfTruth> {

  @IsDefined({ message: ValidationErrors.SIGNER_NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.SIGNER_NAME_REQUIRED })
  @MaxLength(70, { message: ValidationErrors.CONTENT_TOO_LONG })
  signerName?: string

  @IsDefined({ message: ValidationErrors.SIGNER_ROLE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.SIGNER_ROLE_REQUIRED })
  @MaxLength(255, { message: ValidationErrors.CONTENT_TOO_LONG })
  signerRole?: string

  constructor (signerName?: string, signerRole?: string) {
    this.signerName = signerName
    this.signerRole = signerRole
  }

  static fromObject (value?: any): StatementOfTruth {
    if (value != null) {
      return new StatementOfTruth(value.signerName, value.signerRole)
    }

    return new StatementOfTruth()
  }

  deserialize (input?: any): StatementOfTruth {
    if (input) {
      this.signerName = input.signerName
      this.signerRole = input.signerRole
    }

    return this
  }
}
