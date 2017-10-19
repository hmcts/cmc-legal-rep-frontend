import { IsDefined } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly FILES_REQUIRED: string = 'Please upload the requested files'
}

export class DocumentUpload implements Serializable<DocumentUpload> {

  @IsDefined({ message: ValidationErrors.FILES_REQUIRED })
  files?: FileList

  constructor (files?: FileList) {
    this.files = files
  }

  static fromObject (value?: any): DocumentUpload {
    if (value != null) {
      return new DocumentUpload(value.files)
    }

    return value
  }

  deserialize (input?: any): DocumentUpload {
    if (input) {
      this.files = input.files
    }

    return this
  }
}
