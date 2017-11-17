import { Serializable } from 'app/models/serializable'

export default class DraftUploadDocument implements Serializable<DraftUploadDocument> {
  fileToUpload: string = ''

  deserialize (input: any): DraftUploadDocument {
    if (input) {
      this.fileToUpload = input.fileToUpload
    }

    return this
  }
}
