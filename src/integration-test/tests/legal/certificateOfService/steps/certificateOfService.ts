import { WhatDocumentsPage } from 'integration-test/tests/legal/certificateOfService/pages/what-documents'
import { DocumentUploadPage } from 'integration-test/tests/legal/certificateOfService/pages/document-upload'

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
