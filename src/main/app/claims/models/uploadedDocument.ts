import { Serializable } from 'models/serializable'

export class UploadedDocument implements Serializable<UploadedDocument> {
  fileName: string
  documentManagementURI: string

  constructor (fileName?: string, documentManagementURI?: string) {
    this.fileName = fileName
    this.documentManagementURI = documentManagementURI
  }

  deserialize (input: any): UploadedDocument {
    if (input) {
      this.fileName = input.fileName
      this.documentManagementURI = input.documentManagementURI
    }
    return this
  }
}
