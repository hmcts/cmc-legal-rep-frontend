import { MaxLength, ValidateIf, IsDefined } from 'class-validator'
import { IsNotBlank } from 'app/forms/validation/validators/isNotBlank'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly OTHER_DOCUMENTS_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly OTHER_DOCUMENTS_REQUIRED: string = 'Enter a description'
}

export class DocumentType implements Serializable<DocumentType> {

  types?: string[]

  @ValidateIf(o => o.types.indexOf('other') !== -1)
  @MaxLength(255, { message: ValidationErrors.OTHER_DOCUMENTS_TOO_LONG })
  @IsDefined({ message: ValidationErrors.OTHER_DOCUMENTS_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.OTHER_DOCUMENTS_REQUIRED })
  otherDocuments?: string

  constructor (types?: string[], otherDocuments?: string) {
    this.types = types
    this.otherDocuments = otherDocuments
  }

  static fromObject (value?: any): DocumentType {
    if (value != null) {
      return new DocumentType(value.types, value.otherDocuments)
    }

    return new DocumentType()
  }

  deserialize (input: any): DocumentType {
    if (input) {
      this.types = input.types
      this.otherDocuments = input.otherDocuments
    }
    return this
  }
}
