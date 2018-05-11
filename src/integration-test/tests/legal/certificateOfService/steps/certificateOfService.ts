import { WhatDocumentsPage } from '../pages/what-documents'
import { DocumentUploadPage } from '../pages/document-upload'

const whatDocumentsPage: WhatDocumentsPage = new WhatDocumentsPage()
const documentUploadPage: DocumentUploadPage = new DocumentUploadPage()

export class CertificateOfServiceSteps {
  uploadDocument (): void {
    whatDocumentsPage.open()
    whatDocumentsPage.selectFileUploadCheckBox()
    whatDocumentsPage.selectSaveAndContinueButton()
    documentUploadPage.selectParticularsOfClaimFile()
  }
}
