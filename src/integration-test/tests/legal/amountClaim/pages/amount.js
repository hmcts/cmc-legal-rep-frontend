'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {
    lowerValue: 'input[id=lowerValue]',
    higherValue: 'input[id=higherValue]',
    cannotState: 'input[id=cannotState]'
  },
  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/claim/amount')
  },

  enterHigherValueOfTheClaim () {
    I.fillField(this.fields.higherValue, '1000')
    I.click(this.buttons.saveAndContinue)
  },

  enterRangeOfTheClaim () {
    I.fillField(this.fields.lowerValue, '3000')
    I.fillField(this.fields.higherValue, '6000')
    I.click(this.buttons.saveAndContinue)
  },

  canNotStateTheClaim () {
    I.checkOption(this.fields.cannotState)
    I.click(this.buttons.saveAndContinue)
  }
}
