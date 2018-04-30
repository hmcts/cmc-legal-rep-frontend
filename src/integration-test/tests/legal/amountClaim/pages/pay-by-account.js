'use strict'
/* global actor */
const verifyPageData = require('../../../../data/legal-test-data').verifyPageData

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {
    feeAccountReference: 'input[id=reference]'
  },
  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/claim/pay-by-account')
  },

  enterFeeAccountNumber () {
    I.see(verifyPageData.feesPaid)
    I.fillField(this.fields.feeAccountReference, verifyPageData.feeAccountNumber)
    I.click(this.buttons.saveAndContinue)
  }
}
