import { Serializable } from 'models/serializable'
import { IsDefined } from 'class-validator'

export class ValidationErrors {
  static readonly FILE_REQUIRED: string = 'Please upload a file'
}

export class DocumentUpload implements Serializable<DocumentUpload> {

  @IsDefined({ message: ValidationErrors.FILE_REQUIRED })
  files?: string

  constructor (files?: string) {
    this.files = files
  }

  static fromObject (value?: any): DocumentUpload {
    if (value == null) {
      return value
    }
    return new DocumentUpload((value.files))
  }

  deserialize (input?: any): DocumentUpload {
    if (input) {
      this.files = input.files
    }

    return this
  }
}
