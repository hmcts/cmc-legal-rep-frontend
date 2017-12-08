import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly documentUploadPage = new RoutablePath('/legal/certificateOfService/document-upload')
  static readonly documentRemovePage = new RoutablePath('/legal/certificateOfService/document-remove')
  static readonly documentDownloadPage = new RoutablePath('/legal/certificateOfService/document-download')
  static readonly whatDocumentsPage = new RoutablePath('/legal/certificateOfService/what-documents')
  static readonly fileUploadPage = new RoutablePath('/legal/certificateOfService/file-upload')
}
