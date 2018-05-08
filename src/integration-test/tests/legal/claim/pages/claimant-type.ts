const verifyPageData = require('../../../../data/legal-test-data').verifyPageData

import I = CodeceptJS.I

const I: I = actor()

const fields = {
  organisationType: 'input[id=organisationType]',
  organisationName: 'input[id=organisation]',
  companyHouseNumber: 'input[id=companyHouseNumber]',
  individualType: 'input[id=individualType]',
  individualFullName: 'input[id=fullName]',
  changeFirstClaimant: '//*[@href="/legal/claim/claimant-change?index=1"]',
  removeSecondClaimant: '//*[@href="/legal/claim/claimant-remove?index=2"]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

const data = {
  individualFullNameText: 'Mr Benugo',
  updatedNameText: 'Mr Gourmet',
  removeButtonText: 'Remove',
  changeButtonText: 'Change'
}

export class ClaimantTypePage {
  open () {
    I.amOnLegalAppPage('/claim/claimant-type')
  }

  enterClaimantTypeIndividual () {
    I.checkOption(fields.individualType)
    I.fillField(fields.individualFullName, data.individualFullNameText)
    I.click(buttons.saveAndContinue)
  }

  verifyClaimantIndividualDetails () {
    I.see('Claimant')
    I.see(data.individualFullNameText)
    I.see(data.removeButtonText)
    I.see(data.changeButtonText)
  }

  changeRemoveIndividualClaimantDetails () {
    I.click(fields.removeSecondClaimant)
    I.click(fields.changeFirstClaimant)
    I.checkOption(fields.organisationType)
    I.fillField(fields.organisationName, data.updatedNameText)
    I.click(buttons.saveAndContinue)
    I.click(buttons.saveAndContinue)
    I.see(data.updatedNameText)
  }

  enterClaimantTypeOrganisation () {
    I.checkOption(fields.organisationType)
    I.fillField(fields.organisationName, verifyPageData.claimantOrganization)
    I.fillField(fields.companyHouseNumber, '12345')
    I.click(buttons.saveAndContinue)
  }

  enterOnlyMandatoryClaimantTypeData () {
    I.checkOption(fields.organisationType)
    I.fillField(fields.organisationName, verifyPageData.claimantOrganization)
    I.click(buttons.saveAndContinue)
  }
}
