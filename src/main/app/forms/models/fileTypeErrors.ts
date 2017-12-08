export class FileUploadErrors {
  static readonly WRONG_FILE_TYPE = new FileUploadErrors('WRONG_FILE_TYPE', 'We can’t accept the file type you chose.', 'wrongFileType')
  static readonly FILE_TOO_LARGE = new FileUploadErrors('FILE_TOO_LARGE', 'Choose a file sized 10MB or smaller', 'fileTooLarge')
  static readonly FILE_REQUIRED = new FileUploadErrors('FILE_REQUIRED', 'Select ‘choose file’ before you upload', 'fileRequired')
  static readonly FILE_UPLOAD_TIMEOUT = new FileUploadErrors('FILE_UPLOAD_TIMEOUT', 'File took too long to upload', 'fileUploadTimeout')

  readonly value: string
  readonly displayValue: string
  readonly dataStoreValue: string

  constructor (value: string, displayValue: string, dataStoreValue: string) {
    this.value = value
    this.displayValue = displayValue
    this.dataStoreValue = dataStoreValue
  }

  static all (): FileUploadErrors[] {
    return [
      FileUploadErrors.WRONG_FILE_TYPE,
      FileUploadErrors.FILE_TOO_LARGE,
      FileUploadErrors.FILE_REQUIRED,
      FileUploadErrors.FILE_UPLOAD_TIMEOUT
    ]
  }
}
