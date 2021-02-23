import { verifyPageData } from 'integration-test/data/legal-test-data'

import I = CodeceptJS.I

const I: I = actor()

const fields = {
  organisationType:   { css: 'input[id=organisationType]' },
  organisationName:   { css: 'input[id=organisation]' },
  companyHouseNumber: { css: 'input[id=companyHouseNumber]' },
  individualType:     { css: 'input[id=individualType]' },
  individualFullName: { css: 'input[id=fullName]' },
  changeFirstClaimant: '//*[@href="/claim/claimant-change?index=1"]',
  removeSecondClaimant: '//*[@href="/claim/claimant-remove?index=2"]'
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
  open (): void {
    I.amOnLegalAppPage('/claim/claimant-type')
  }

  enterClaimantTypeIndividual (): void {
    I.waitForElement(fields.individualType)
    I.checkOption(fields.individualType)
    I.waitForVisible(fields.individualFullName)
    I.fillField(fields.individualFullName, data.individualFullNameText)
    I.click(buttons.saveAndContinue)
  }

  verifyClaimantIndividualDetails (): void {
    I.waitForText('Claimant')
    I.see(data.individualFullNameText)
    I.see(data.removeButtonText)
    I.see(data.changeButtonText)
  }

  changeRemoveIndividualClaimantDetails (): void {
    I.waitForElement(fields.removeSecondClaimant)
    I.click(fields.removeSecondClaimant)
    I.click(fields.changeFirstClaimant)
    I.checkOption(fields.organisationType)
    I.waitForVisible(fields.organisationName)
    I.fillField(fields.organisationName, data.updatedNameText)
    I.click(buttons.saveAndContinue)
    I.click(buttons.saveAndContinue)
    I.see(data.updatedNameText)
  }

  enterClaimantTypeOrganisation (): void {
    I.waitForElement(fields.organisationType)
    I.checkOption(fields.organisationType)
    I.waitForVisible(fields.organisationName)
    I.fillField(fields.organisationName, verifyPageData.claimantOrganization)
    I.fillField(fields.companyHouseNumber, '12345')
    I.click(buttons.saveAndContinue)
  }

  enterOnlyMandatoryClaimantTypeData (): void {
    I.waitForElement(fields.organisationType)
    I.checkOption(fields.organisationType)
    I.waitForVisible(fields.organisationName)
    I.fillField(fields.organisationName, verifyPageData.claimantOrganization)
    I.click(buttons.saveAndContinue)
  }
}
