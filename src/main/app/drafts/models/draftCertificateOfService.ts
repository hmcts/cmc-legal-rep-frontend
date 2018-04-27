import { Serializable } from 'models/serializable'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { WhatDocuments } from 'forms/models/whatDocuments'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FileUploadErrors } from 'forms/models/fileTypeErrors'
import { DocumentType } from 'forms/models/documentType'

export class DraftCertificateOfService extends DraftDocument implements Serializable<DraftCertificateOfService> {
  uploadedDocuments: UploadedDocument[] = []
  whatDocuments: WhatDocuments = new WhatDocuments()
  fileToUpload: DocumentType
  fileToUploadError: FileUploadErrors

  deserialize (input: any): DraftCertificateOfService {
    if (input) {
      this.whatDocuments = input.whatDocuments
      this.fileToUpload = input.fileToUpload
      this.fileToUploadError = input.fileToUploadError

      if (input.uploadedDocuments && input.uploadedDocuments.length > 0) {
        this.uploadedDocuments = input.uploadedDocuments.map((uploadedDocument) => new UploadedDocument().deserialize(uploadedDocument))
      }
    }

    return this
  }
}
