export class FileTypeErrors {
  static readonly WRONG_FILE_TYPE = new FileTypeErrors('WRONG_FILE_TYPE', 'We can’t accept the file type you chose.', 'wrongFileType')
  static readonly FILE_TOO_LARGE = new FileTypeErrors('FILE_TOO_LARGE', 'Choose a file sized 10MB or smaller', 'fileTooLarge')
  static readonly FILE_REQUIRED = new FileTypeErrors('FILE_REQUIRED', 'Select ‘choose file’ before you upload', 'fileRequired')
  static readonly REQUEST_TIMEOUT = new FileTypeErrors('REQUEST_TIMEOUT', 'File took too long to upload', 'timeout')

  readonly value: string
  readonly displayValue: string
  readonly dataStoreValue: string

  constructor (value: string, displayValue: string, dataStoreValue: string) {
    this.value = value
    this.displayValue = displayValue
    this.dataStoreValue = dataStoreValue
  }

  static all (): FileTypeErrors[] {
    return [
      FileTypeErrors.WRONG_FILE_TYPE,
      FileTypeErrors.FILE_TOO_LARGE,
      FileTypeErrors.FILE_REQUIRED,
      FileTypeErrors.REQUEST_TIMEOUT
    ]
  }
}
