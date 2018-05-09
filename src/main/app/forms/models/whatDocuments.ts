import { MaxLength, ValidateIf, IsDefined } from 'class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { Serializable } from 'models/serializable'
import { DocumentType } from 'forms/models/documentType'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly OTHER_DOCUMENTS_REQUIRED: string = 'Tell us which other documents you served'
}

export class WhatDocuments implements Serializable<WhatDocuments> {

  types?: string[]

  @ValidateIf(o => o.types.indexOf(DocumentType.OTHER.dataStoreValue) !== -1)
  @MaxLength(255, { message: CommonValidationErrors.CONTENT_TOO_LONG })
  @IsDefined({ message: ValidationErrors.OTHER_DOCUMENTS_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.OTHER_DOCUMENTS_REQUIRED })
  otherDocuments?: string

  constructor (types?: string[], otherDocuments?: string) {
    const defaultedValues = []
    this.types = defaultedValues.concat(types)
    this.otherDocuments = otherDocuments
  }

  static fromObject (value?: any): WhatDocuments {
    if (value != null) {
      return new WhatDocuments(value.types, value.otherDocuments)
    }

    return new WhatDocuments()
  }

  deserialize (input: any): WhatDocuments {
    if (input) {
      this.types = input.types
      this.otherDocuments = input.otherDocuments
    }
    return this
  }
}
