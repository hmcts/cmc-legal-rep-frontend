import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  particularsOfClaim: 'input[name=particularsOfClaim]',
  particularsOfClaimFile: 'input[id="files[label]"]',
  uploadFileButton: 'input.button'
}

export class DocumentUploadPage {
  open (): void {
    I.amOnLegalAppPage('/certificateOfService/what-documents')
  }

  selectParticularsOfClaimFile (): void {
    I.click(buttons.particularsOfClaim)
    I.attachFile(buttons.particularsOfClaimFile, 'src/data/legalUpload.pdf')
    I.click(buttons.uploadFileButton)
    I.waitForText('legalUpload.pdf')
    I.click('legalUpload.pdf')
  }
}
