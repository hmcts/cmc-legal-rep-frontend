export class FileTypes {
  static readonly PDF = new FileTypes('.pdf', 'Adobe Portable Document Format (PDF)', 'application/pdf')
  static readonly DOC = new FileTypes('.doc', 'Microsoft Word', 'application/msword')
  static readonly DOCX = new FileTypes('.docx', 'Microsoft Word', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  static readonly JPEG = new FileTypes('.jpeg', 'JPEG images', 'image/jpeg')
  static readonly PNG = new FileTypes('.png', 'Portable Network Graphics', 'image/png')
  static readonly XLS = new FileTypes('.xls', 'Microsoft Excel', 'application/vnd.ms-excel')
  static readonly XLSX = new FileTypes('.xlsx', 'Microsoft Excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

  readonly extension: string
  readonly mimeType: string
  readonly description: string

  constructor (extension: string, description: string, mimeType: string) {
    this.extension = extension
    this.description = description
    this.mimeType = mimeType
  }

  static all (): FileTypes[] {
    return [
      FileTypes.PDF,
      FileTypes.DOC,
      FileTypes.DOCX,
      FileTypes.JPEG,
      FileTypes.PNG,
      FileTypes.XLS,
      FileTypes.XLSX
    ]
  }

  static acceptedFiles (): string {
    let acceptedFileTypes = ''
    this.all().forEach(function (fileType) {
      acceptedFileTypes += fileType.extension + ',' + fileType.mimeType + ','
    })
    return acceptedFileTypes.slice(0, -1)
  }

  static acceptedMimeTypes (): string[] {
    let acceptedFileExtensions = []
    this.all().forEach(function (fileType) {
      acceptedFileExtensions.push(fileType.mimeType)
    })
    return acceptedFileExtensions
  }
}
