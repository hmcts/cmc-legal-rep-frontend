'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },

  fields: {
    courtName: 'input[id=name]'
  },

  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/claim/preferred-court')
  },

  enterYourPreferredCountyCourt () {
    I.fillField(this.fields.courtName, 'Dartford County Court')
    I.click(this.buttons.saveAndContinue)
  },
  submitOnlyMandatoryData () {
    I.click(this.buttons.saveAndContinue)
  }

}
