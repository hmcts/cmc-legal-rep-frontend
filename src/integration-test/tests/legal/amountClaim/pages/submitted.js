'use strict'
/* global actor */

const verifyPageData = require('../../../../data/legal-test-data').verifyPageData

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const expect = chai.expect

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {

  },
  buttons: {
    finish: 'input.button.button-start'
  },

  open () {
    I.amOnLegalAppPage('/claim/submitted')
  },

  verifyTextInSubmittedPage (userEmail, dateCheck) {
    I.see(verifyPageData.feesPaid)
    I.see(verifyPageData.emailConfirmation + userEmail)
    // verify submit date text present or not
    expect(dateCheck[0].length).to.be.greaterThan(20)
    // verify issue date text present or not
    expect(dateCheck[1].length).to.be.greaterThan(17)
  },

  selectSubmitButton () {
    I.click(this.buttons.finish)
    I.see('start')
  }
}
