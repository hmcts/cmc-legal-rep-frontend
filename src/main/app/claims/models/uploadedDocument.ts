import { Serializable } from 'models/serializable'
import { DocumentType } from 'forms/models/documentType'
import { FileTypes } from 'forms/models/fileTypes'

export class UploadedDocument implements Serializable<UploadedDocument> {
  fileName: string
  fileType: FileTypes
  documentType: DocumentType
  documentManagementURI: string

  constructor (fileName?: string, fileType?: FileTypes, documentType?: DocumentType, documentManagementURI?: string) {
    this.fileName = fileName
    this.fileType = fileType
    this.documentType = documentType
    this.documentManagementURI = documentManagementURI
  }

  deserialize (input: any): UploadedDocument {
    if (input) {
      this.fileName = input.fileName
      this.fileType = input.fileType
      this.documentType = input.documentType
      this.documentManagementURI = input.documentManagementURI
    }
    return this
  }

  getId (): string {
    return this.documentManagementURI.slice(11)
  }
}
