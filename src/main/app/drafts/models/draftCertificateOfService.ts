import { Serializable } from 'models/serializable'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { DocumentType } from 'app/forms/models/documentType'

export class DraftCertificateOfService implements Serializable<DraftCertificateOfService> {
  uploadedDocuments: UploadedDocument = new UploadedDocument()
  whatDocuments: DocumentType = new DocumentType()

  deserialize (input: any): DraftCertificateOfService {
    if (input) {
      this.uploadedDocuments = input.uploadedDocuments
      this.whatDocuments = input.whatDocuments
    }

    return this
  }
}
