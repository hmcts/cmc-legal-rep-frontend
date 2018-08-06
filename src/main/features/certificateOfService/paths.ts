import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly documentUploadPage = new RoutablePath('/certificateOfService/document-upload')
  static readonly documentRemovePage = new RoutablePath('/certificateOfService/document-remove')
  static readonly documentDownloadPage = new RoutablePath('/certificateOfService/document-download')
  static readonly whatDocumentsPage = new RoutablePath('/certificateOfService/what-documents')
  static readonly fileUploadPage = new RoutablePath('/certificateOfService/file-upload')
}
