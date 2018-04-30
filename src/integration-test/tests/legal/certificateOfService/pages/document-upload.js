'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },
  buttons: {
    particularsOfClaim: 'input[name=particularsOfClaim]',
    particularsOfClaimFile: 'input[id="files[label]"]',
    uploadFileButton: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/certificateOfService/what-documents')
  },
  selectParticularsOfClaimFile () {
    I.click(this.buttons.particularsOfClaim)
    I.attachFile(this.buttons.particularsOfClaimFile, 'src/data/legalUpload.pdf')
    I.click(this.buttons.uploadFileButton)
    I.waitForText('legalUpload.pdf')
    I.click('legalUpload.pdf')
  },
  selectSaveAndContinueButton () {
    I.click(this.buttons.saveAndContinue)
  }

}
