'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {
    addressLine1: 'input[id=line1]',
    addressLine2: 'input[id=line2]',
    cityName: 'input[id=city]',
    postcode: 'input[id=postcode]'
  },
  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/claim/defendant-address')
  },

  enterYourOrganisationAddress () {
    I.fillField(this.fields.addressLine1, 'CMC T2 Defendant')
    I.fillField(this.fields.addressLine2, 'Westminster')
    I.fillField(this.fields.cityName, 'London')
    I.fillField(this.fields.postcode, 'SW1H 9BJ')
    I.click(this.buttons.saveAndContinue)
  },
  enterOnlyMandatoryDefendantOrganisationAddress () {
    I.fillField(this.fields.addressLine1, 'CMC T2 Defendant')
    I.fillField(this.fields.cityName, 'London')
    I.fillField(this.fields.postcode, 'SW1H 9BJ')
    I.click(this.buttons.saveAndContinue)
  }
}
