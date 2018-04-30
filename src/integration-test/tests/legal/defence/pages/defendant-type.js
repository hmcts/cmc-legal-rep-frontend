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
    changeFirstDefendant: '//*[@href="/legal/claim/defendant-change?index=1"]',
    removeSecondDefendant: '//*[@href="/legal/claim/defendant-remove?index=2"]'
  },

  buttons: {
    saveAndContinue: 'input.button'
  },
  data: {
    defendantOneOrganisationNameText: verifyPageData.defendantOrganization,
    defendantTwoOrganisationNameText: 'Ghi corporation',
    individualFullNameText: 'Mr Pret',
    updatedNameText: 'DefendantChange',
    removeButtonText: 'Remove',
    changeButtonText: 'Change'
  },
  open () {
    I.amOnLegalAppPage('/claim/defendant-type')
  },

  enterDefendantTypeIndividual () {
    I.checkOption(this.fields.individualType)
    I.fillField(this.fields.individualFullName, this.data.individualFullNameText)
    I.click(this.buttons.saveAndContinue)
  },

  enterDefendantTypeOrganisation () {
    I.checkOption(this.fields.organisationType)
    I.fillField(this.fields.organisationName, verifyPageData.defendantOrganization)
    I.fillField(this.fields.companyHouseNumber, '678910')
    I.click(this.buttons.saveAndContinue)
  },

  enterOnlyMandatoryDefendantTypeDetails () {
    I.checkOption(this.fields.organisationType)
    I.fillField(this.fields.organisationName, verifyPageData.defendantOrganization)
    I.click(this.buttons.saveAndContinue)
  },

  enterAnotherDefendantTypeIndividual () {
    I.checkOption(this.fields.individualType)
    I.fillField(this.fields.individualFullName, 'Mrs Orange')
    I.click(this.buttons.saveAndContinue)
  },

  enterAnotherDefendantTypeOrganisation () {
    I.checkOption(this.fields.organisationType)
    I.fillField(this.fields.organisationName, this.data.defendantTwoOrganisationNameText)
    I.fillField(this.fields.companyHouseNumber, '111213')
    I.click(this.buttons.saveAndContinue)
  },

  verifyDefendantOrganisationDetails () {
    I.see('Defendant')
    I.see(verifyPageData.defendantOrganization)
    I.see('Mrs Orange')
    I.see(this.data.defendantTwoOrganisationNameText)
    I.see(this.data.removeButtonText)
    I.see(this.data.changeButtonText)
  },
  changeRemoveIndividualDefendantDetails () {
    I.click(this.data.removeButtonText, this.fields.removeSecondDefendant)
    I.click(this.data.changeButtonText, this.fields.changeFirstDefendant)
    I.checkOption(this.fields.individualType)
    I.fillField(this.fields.individualFullName, this.data.updatedNameText)
    I.click(this.buttons.saveAndContinue)
    I.click(this.buttons.saveAndContinue)
    I.click(this.buttons.saveAndContinue)
    I.click(this.buttons.saveAndContinue)
    I.see(this.data.updatedNameText)
  }
}
