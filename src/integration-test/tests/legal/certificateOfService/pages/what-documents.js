'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {
    typesResponsePack: 'input[id=typesresponsePack]'
  },
  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/certificateOfService/what-documents')
  },

  selectFileUploadCheckBox () {
    I.checkOption(this.fields.typesResponsePack)
  },
  selectSaveAndContinueButton () {
    I.click(this.buttons.saveAndContinue)
  }

}
