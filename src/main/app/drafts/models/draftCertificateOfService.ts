import { Serializable } from 'models/serializable'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { WhatDocuments } from 'app/forms/models/whatDocuments'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'

export class DraftCertificateOfService extends DraftDocument implements Serializable<DraftCertificateOfService> {
  uploadedDocuments: UploadedDocument[] = []
  whatDocuments: WhatDocuments = new WhatDocuments()

  deserialize (input: any): DraftCertificateOfService {
    if (input) {
      this.uploadedDocuments = input.uploadedDocuments
      this.whatDocuments = input.whatDocuments

      if (input.uploadedDocuments && input.uploadedDocuments.length > 0) {
        const uploadedDocuments: UploadedDocument[] = input.uploadedDocuments.map((uploadedDocument) => uploadedDocuments.push(new UploadedDocument().deserialize(uploadedDocument)))
        this.uploadedDocuments = uploadedDocuments
      }
    }

    return this
  }
}
