'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },

  fields: {
    isAddClaimantYes: 'input[id=claimant_add_yes]',
    isAddClaimantNo: 'input[id=claimant_add_no]'
  },

  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/claim/claimant-add')
  },

  enterAdditionalClaimant () {
    I.checkOption(this.fields.isAddClaimantYes)
    I.click(this.buttons.saveAndContinue)
  },

  chooseNoAdditionalClaimant () {
    I.checkOption(this.fields.isAddClaimantNo)
    I.click(this.buttons.saveAndContinue)
  }
}
