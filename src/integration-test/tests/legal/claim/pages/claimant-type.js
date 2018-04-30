'use strict'
/* global actor */
const verifyPageData = require('../../../../data/legal-test-data').verifyPageData

let I

module.exports = {

  _init () {
    I = actor()
  },

  fields: {
    organisationType: 'input[id=organisationType]',
    organisationName: 'input[id=organisation]',
    companyHouseNumber: 'input[id=companyHouseNumber]',
    individualType: 'input[id=individualType]',
    individualFullName: 'input[id=fullName]',
    changeFirstClaimant: '//*[@href="/legal/claim/claimant-change?index=1"]',
    removeSecondClaimant: '//*[@href="/legal/claim/claimant-remove?index=2"]'
  },

  buttons: {
    saveAndContinue: 'input.button'
  },

  data: {
    individualFullNameText: 'Mr Benugo',
    updatedNameText: 'Mr Gourmet',
    removeButtonText: 'Remove',
    changeButtonText: 'Change'
  },

  open () {
    I.amOnLegalAppPage('/claim/claimant-type')
  },

  enterClaimantTypeIndividual () {
    I.checkOption(this.fields.individualType)
    I.fillField(this.fields.individualFullName, this.data.individualFullNameText)
    I.click(this.buttons.saveAndContinue)
  },
  verifyClaimantIndividualDetails () {
    I.see('Claimant')
    I.see(this.data.individualFullNameText)
    I.see(this.data.removeButtonText)
    I.see(this.data.changeButtonText)
  },
  changeRemoveIndividualClaimantDetails () {
    I.click(this.data.removeButtonText, this.fields.removeSecondClaimant)
    I.click(this.data.changeButtonText, this.fields.changeFirstClaimant)
    I.checkOption(this.fields.organisationType)
    I.fillField(this.fields.organisationName, this.data.updatedNameText)
    I.click(this.buttons.saveAndContinue)
    I.click(this.buttons.saveAndContinue)
    I.see(this.data.updatedNameText)
  },
  enterClaimantTypeOrganisation () {
    I.checkOption(this.fields.organisationType)
    I.fillField(this.fields.organisationName, verifyPageData.claimantOrganization)
    I.fillField(this.fields.companyHouseNumber, '12345')
    I.click(this.buttons.saveAndContinue)
  },
  enterOnlyMandatoryClaimantTypeData () {
    I.checkOption(this.fields.organisationType)
    I.fillField(this.fields.organisationName, verifyPageData.claimantOrganization)
    I.click(this.buttons.saveAndContinue)
  }
}
