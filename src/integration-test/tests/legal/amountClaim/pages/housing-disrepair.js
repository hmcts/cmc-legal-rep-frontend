'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {
    housingDisrepairYes: 'input[id=housing_disrepair_yes]',
    housingDisrepairNo: 'input[id=housing_disrepair_no]',
    generalDamagesLess: 'input[id="generalDamages[value]LESS"]',
    generalDamagesMore: 'input[id="generalDamages[value]MORE"]',
    otherDamagesNone: 'input[id="otherDamages[value]NONE"]',
    otherDamagesLess: 'input[id="otherDamages[value]LESS"]',
    otherDamagesMore: 'input[id="otherDamages[value]MORE"]'
  },
  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/claim/housing-disrepair')
  },

  enterHousingDisrepairGeneralDamagesLessThan1000 () {
    I.checkOption(this.fields.housingDisrepairYes)
    I.checkOption(this.fields.generalDamagesLess)
    I.click(this.buttons.saveAndContinue)
  },

  enterHousingDisrepairGeneralDamagesMoreThan1000 () {
    I.checkOption(this.fields.housingDisrepairYes)
    I.checkOption(this.fields.generalDamagesMore)
    I.click(this.buttons.saveAndContinue)
  },

  enterHousingDisrepairOtherDamagesLessThan1000 () {
    I.checkOption(this.fields.housingDisrepairYes)
    I.checkOption(this.fields.otherDamagesLess)
    I.click(this.buttons.saveAndContinue)
  },

  enterHousingDisrepairOtherDamagesMoreThan1000 () {
    I.checkOption(this.fields.housingDisrepairYes)
    I.checkOption(this.fields.otherDamagesMore)
    I.click(this.buttons.saveAndContinue)
  },

  enterHousingDisrepairNoOtherDamages () {
    I.checkOption(this.fields.housingDisrepairYes)
    I.checkOption(this.fields.otherDamagesNone)
    I.click(this.buttons.saveAndContinue)
  },

  noHousingDisrepair () {
    I.checkOption(this.fields.housingDisrepairNo)
    I.click(this.buttons.saveAndContinue)
  }
}
