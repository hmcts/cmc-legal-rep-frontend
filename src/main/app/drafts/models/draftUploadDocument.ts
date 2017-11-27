import { Serializable } from 'app/models/serializable'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { DocumentType } from 'forms/models/documentType'

export class DraftUploadDocument extends DraftDocument implements Serializable<DraftUploadDocument> {
  fileToUpload: DocumentType

  deserialize (input: any): DraftUploadDocument {
    if (input) {
      this.fileToUpload = input.fileToUpload
    }

    return this
  }
}
