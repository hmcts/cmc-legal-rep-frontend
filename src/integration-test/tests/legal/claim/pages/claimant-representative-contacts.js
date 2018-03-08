'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {
    phoneNumber: 'input[id=phoneNumber]',
    email: 'input[id=email]',
    dxAddress: 'input[id=dxAddress]'
  },
  buttons: {
    saveAndContinue: 'input.button'
  },

  data: {
    phoneNumberText: '0700000000',
    emailText: 'vivred@mailinator.com',
    dxAddressText: 'DX123'
  },

  open () {
    I.amOnLegalAppPage('/claim/representative-contacts')
  },

  enterYourOrganisationContactDetails () {
    I.fillField(this.fields.phoneNumber, this.data.phoneNumberText)
    I.fillField(this.fields.email, this.data.emailText)
    I.fillField(this.fields.dxAddress, this.data.dxAddressText)
    I.click(this.buttons.saveAndContinue)
  },

  verifyContactDetails () {
    I.seeInField(this.fields.phoneNumber, this.data.phoneNumberText)
    I.seeInField(this.fields.email, this.data.emailText)
    I.seeInField(this.fields.dxAddress, this.data.dxAddressText)
  },
  submitOnlyMandatoryData () {
    I.click(this.buttons.saveAndContinue)
  }

}
