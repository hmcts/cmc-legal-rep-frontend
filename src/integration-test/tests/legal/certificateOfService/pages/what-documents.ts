import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  saveAndContinue: 'input.button'
}

const fields = {
  typesResponsePack: 'input[id=typesresponsePack]'
}

export class WhatDocumentsPage {
  open () {
    I.amOnLegalAppPage('/certificateOfService/what-documents')
  }

  selectFileUploadCheckBox () {
    I.checkOption(fields.typesResponsePack)
  }

  selectSaveAndContinueButton () {
    I.click(buttons.saveAndContinue)
  }
}
