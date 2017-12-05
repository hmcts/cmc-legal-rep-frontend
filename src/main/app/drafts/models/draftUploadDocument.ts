import { Serializable } from 'app/models/serializable'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { DocumentType } from 'forms/models/documentType'
import { FileTypeErrors } from 'forms/models/fileTypeErrors'

export class DraftUploadDocument extends DraftDocument implements Serializable<DraftUploadDocument> {
  fileToUpload: DocumentType
  fileToUploadError: FileTypeErrors

  deserialize (input: any): DraftUploadDocument {
    if (input) {
      this.fileToUpload = input.fileToUpload
      this.fileToUploadError = input.fileToUploadError
    }

    return this
  }
}
