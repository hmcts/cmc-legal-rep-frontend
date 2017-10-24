import { Serializable } from 'models/serializable'

export class UploadedDocument implements Serializable<UploadedDocument> {
  fileName: string
  documentManagement: string

  constructor (fileName?: string, documentManagement?: string) {
    this.fileName = fileName
    this.documentManagement = documentManagement
  }

  deserialize (input: any): UploadedDocument {
    if (input) {
      this.fileName = input.fileName
      this.documentManagement = input.documentManagement
    }
    return this
  }
}
