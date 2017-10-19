import { Serializable } from 'models/serializable'
import * as uuid from 'uuid'
import { DocumentUpload } from 'forms/models/documentUpload'

export class DraftCertificateOfService implements Serializable<DraftCertificateOfService> {
  externalId = uuid()
  uploadedDocuments: DocumentUpload = new DocumentUpload()

  deserialize (input: any): DraftCertificateOfService {
    if (input) {
      this.externalId = input.externalId
      this.uploadedDocuments = input.uploadedDocuments
    }

    return this
  }
}
