'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {
    signerName: 'input[id=signerName]',
    signerRole: 'input[id=signerRole]'
  },
  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/claim/statement-of-truth')
  },

  enterStatementOfTruthSignerNameAndRole () {
    I.fillField(this.fields.signerName, 'vivred')
    I.fillField(this.fields.signerRole, 'QA')
    I.see('Abc Organisation')
    I.click(this.buttons.saveAndContinue)
  }

}
