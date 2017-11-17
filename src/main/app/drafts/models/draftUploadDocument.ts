import { Serializable } from 'app/models/serializable'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'

export default class DraftUploadDocument extends DraftDocument implements Serializable<DraftUploadDocument> {
  fileToUpload: string = ''

  deserialize (input: any): DraftUploadDocument {
    if (input) {
      this.fileToUpload = input.fileToUpload
    }

    return this
  }
}
