const verifyPageData = require('../../../../data/legal-test-data').verifyPageData

import I = CodeceptJS.I

const I: I = actor()

const fields = {
  organisationType: 'input[id=organisationType]',
  organisationName: 'input[id=organisation]',
  companyHouseNumber: 'input[id=companyHouseNumber]',
  individualType: 'input[id=individualType]',
  individualFullName: 'input[id=fullName]',
  changeFirstDefendant: '//*[@href="/legal/claim/defendant-change?index=1"]',
  removeSecondDefendant: '//*[@href="/legal/claim/defendant-remove?index=2"]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

const data = {
  defendantOneOrganisationNameText: verifyPageData.defendantOrganization,
  defendantTwoOrganisationNameText: 'Ghi corporation',
  individualFullNameText: 'Mr Pret',
  updatedNameText: 'DefendantChange',
  removeButtonText: 'Remove',
  changeButtonText: 'Change'
}

export class DefendantTypePage {
  open () {
    I.amOnLegalAppPage('/claim/defendant-type')
  }

  enterDefendantTypeIndividual () {
    I.checkOption(fields.individualType)
    I.fillField(fields.individualFullName, data.individualFullNameText)
    I.click(buttons.saveAndContinue)
  }

  enterDefendantTypeOrganisation () {
    I.checkOption(fields.organisationType)
    I.fillField(fields.organisationName, verifyPageData.defendantOrganization)
    I.fillField(fields.companyHouseNumber, '678910')
    I.click(buttons.saveAndContinue)
  }

  enterOnlyMandatoryDefendantTypeDetails () {
    I.checkOption(fields.organisationType)
    I.fillField(fields.organisationName, verifyPageData.defendantOrganization)
    I.click(buttons.saveAndContinue)
  }

  enterAnotherDefendantTypeIndividual () {
    I.checkOption(fields.individualType)
    I.fillField(fields.individualFullName, 'Mrs Orange')
    I.click(buttons.saveAndContinue)
  }

  enterAnotherDefendantTypeOrganisation () {
    I.checkOption(fields.organisationType)
    I.fillField(fields.organisationName, data.defendantTwoOrganisationNameText)
    I.fillField(fields.companyHouseNumber, '111213')
    I.click(buttons.saveAndContinue)
  }

  verifyDefendantOrganisationDetails () {
    I.see('Defendant')
    I.see(verifyPageData.defendantOrganization)
    I.see('Mrs Orange')
    I.see(data.defendantTwoOrganisationNameText)
    I.see(data.removeButtonText)
    I.see(data.changeButtonText)
  }

  changeRemoveIndividualDefendantDetails () {
    I.click(fields.removeSecondDefendant)
    I.click(fields.changeFirstDefendant)
    I.checkOption(fields.individualType)
    I.fillField(fields.individualFullName, data.updatedNameText)
    I.click(buttons.saveAndContinue)
    I.click(buttons.saveAndContinue)
    I.click(buttons.saveAndContinue)
    I.click(buttons.saveAndContinue)
    I.see(data.updatedNameText)
  }
}
