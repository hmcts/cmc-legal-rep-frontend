'use strict'
/* global actor */
const verifyPageData = require('../../../../data/legal-test-data').verifyPageData

let I

module.exports = {

  _init () {
    I = actor()
  },

  fields: {
    referenceNumber: 'input[id=reference]'
  },

  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/claim/your-reference')
  },

  enterYourReferenceForClaim () {
    I.fillField(this.fields.referenceNumber, verifyPageData.organizationRefNumber)
    I.click(this.buttons.saveAndContinue)
  },
  submitOnlyMandatoryData () {
    I.click(this.buttons.saveAndContinue)
  }

}
