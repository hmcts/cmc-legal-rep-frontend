import * as fileType from 'file-type'
import * as readChunk from 'read-chunk'
import * as CFB from 'cfb'

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

  static isOfAcceptedMimeType (filePath: string): Promise<boolean> {
    return new Promise(accept => {
      const buffer = readChunk.sync(filePath, 0, 4100)
      // file-type package returns null if it does not find a mime type in the first 4100kb
      if (fileType(buffer) && fileType(buffer).mime === 'application/x-msi') {
        let mimeType = ''
        const cfb = CFB.read(filePath, { type: 'file' })
        if (CFB.find(cfb, '/Workbook') !== null) {
          mimeType = 'application/vnd.ms-excel'
        } else if (CFB.find(cfb, '/WordDocument') !== null) {
          mimeType = 'application/msword'
        }
        accept(this.acceptedMimeTypes().includes(mimeType))
      } else if (fileType(buffer)) {
        accept(this.acceptedMimeTypes().includes(fileType(buffer).mime))
      }
    })
  }
}
