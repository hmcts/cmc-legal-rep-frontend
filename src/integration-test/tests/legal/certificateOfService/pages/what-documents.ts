import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  saveAndContinue: 'input.button'
}

const fields = {
  typesResponsePack: 'input[id=typesresponsePack]'
}

export class WhatDocumentsPage {
  open (): void {
    I.amOnLegalAppPage('/certificateOfService/what-documents')
  }

  selectFileUploadCheckBox (): void {
    I.checkOption(fields.typesResponsePack)
  }

  selectSaveAndContinueButton (): void {
    I.click(buttons.saveAndContinue)
  }
}
