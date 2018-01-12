import { Serializable } from 'models/serializable'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { WhatDocuments } from 'app/forms/models/whatDocuments'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { FileUploadErrors } from 'forms/models/fileTypeErrors'
import { DocumentType } from 'forms/models/documentType'
import { TheirDetails } from 'claims/models/theirs/theirDetails'

export class DraftCertificateOfService extends DraftDocument implements Serializable<DraftCertificateOfService> {
  uploadedDocuments: UploadedDocument[] = []
  whatDocuments: WhatDocuments = new WhatDocuments()
  fileToUpload: DocumentType
  fileToUploadError: FileUploadErrors
  defendants: TheirDetails[] = []
  currentDefendant: number = 1

  deserialize (input: any): DraftCertificateOfService {
    if (input) {
      this.whatDocuments = input.whatDocuments
      this.fileToUpload = input.fileToUpload
      this.fileToUploadError = input.fileToUploadError
      this.defendants = input.defendants
      this.currentDefendant = input.currentDefendant

      if (input.uploadedDocuments && input.uploadedDocuments.length > 0) {
        this.uploadedDocuments = input.uploadedDocuments.map((uploadedDocument) => new UploadedDocument().deserialize(uploadedDocument))
      }

      if (input.defendants && input.defendants.length > 0) {
        this.defendants = input.defendants.map((defendant) => new TheirDetails().deserialize(defendant))
      }
    }

    return this
  }
}
