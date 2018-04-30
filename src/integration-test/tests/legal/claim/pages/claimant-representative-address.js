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
  data: {
    addressLine1Text: 'Moj',
    addressLine2Text: 'Westminster',
    cityNameText: 'London',
    postcodeText: 'SW1H 9AJ',
    verifyAddressLine1Text: 'MOJ',
    verifyAddressLine2Text: 'WESTMINSTER',
    verifyCityNameText: 'LONDON'
  },

  open () {
    I.amOnLegalAppPage('/claim/representative-address')
  },

  enterYourOrganisationAddress () {
    I.fillField(this.fields.addressLine1, this.data.addressLine1Text)
    I.fillField(this.fields.addressLine2, this.data.addressLine2Text)
    I.fillField(this.fields.cityName, this.data.cityNameText)
    I.fillField(this.fields.postcode, this.data.postcodeText)
    I.click(this.buttons.saveAndContinue)
  },

  verifyOrganizationAddress () {
    I.seeInField(this.fields.addressLine1, this.data.verifyAddressLine1Text)
    I.seeInField(this.fields.addressLine2, this.data.verifyAddressLine2Text)
    I.seeInField(this.fields.cityName, this.data.verifyCityNameText)
    I.seeInField(this.fields.postcode, this.data.postcodeText)
    I.click(this.buttons.saveAndContinue)
  },

  enterOnlyMandatoryOrganisationAddress () {
    I.fillField(this.fields.addressLine1, this.data.addressLine1Text)
    I.fillField(this.fields.cityName, this.data.cityNameText)
    I.fillField(this.fields.postcode, this.data.postcodeText)
    I.click(this.buttons.saveAndContinue)
  }
}
