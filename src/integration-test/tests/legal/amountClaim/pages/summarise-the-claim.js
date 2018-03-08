'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {
    summariseClaimTextArea: 'textarea[id=text]'
  },
  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/claim/summarise-the-claim')
  },

  enterBriefDescriptionOfTheClaim () {
    I.fillField(this.fields.summariseClaimTextArea, 'I would like to test this with codeceptjs')
    I.click(this.buttons.saveAndContinue)
  }
}
