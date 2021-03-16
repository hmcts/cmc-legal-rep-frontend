import { verifyPageData } from 'integration-test/data/legal-test-data'

import I = CodeceptJS.I

const I: I = actor()

const fields = {
  organisationType:   { css: 'input[id=organisationType]' },
  organisationName:   { css: 'input[id=organisation]' },
  companyHouseNumber: { css: 'input[id=companyHouseNumber]' },
  individualType:     { css: 'input[id=individualType]' },
  individualFullName: { css: 'input[id=fullName]' },
  changeFirstDefendant: '//*[@href="/claim/defendant-change?index=1"]',
  removeSecondDefendant: '//*[@href="/claim/defendant-remove?index=2"]'
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
  open (): void {
    I.amOnLegalAppPage('/claim/defendant-type')
  }

  enterDefendantTypeIndividual (): void {
    I.waitForElement(fields.individualType)
    I.checkOption(fields.individualType)
    I.fillField(fields.individualFullName, data.individualFullNameText)
    I.click(buttons.saveAndContinue)
  }

  enterDefendantTypeOrganisation (): void {
    I.waitForElement(fields.organisationType)
    I.checkOption(fields.organisationType)
    I.fillField(fields.organisationName, verifyPageData.defendantOrganization)
    I.fillField(fields.companyHouseNumber, '678910')
    I.click(buttons.saveAndContinue)
  }

  enterOnlyMandatoryDefendantTypeDetails (): void {
    I.waitForElement(fields.organisationType)
    I.checkOption(fields.organisationType)
    I.fillField(fields.organisationName, verifyPageData.defendantOrganization)
    I.click(buttons.saveAndContinue)
  }

  enterAnotherDefendantTypeIndividual (): void {
    I.waitForElement(fields.individualType)
    I.checkOption(fields.individualType)
    I.fillField(fields.individualFullName, 'Mrs Orange')
    I.click(buttons.saveAndContinue)
  }

  enterAnotherDefendantTypeOrganisation (): void {
    I.waitForElement(fields.organisationType)
    I.checkOption(fields.organisationType)
    I.fillField(fields.organisationName, data.defendantTwoOrganisationNameText)
    I.fillField(fields.companyHouseNumber, '111213')
    I.click(buttons.saveAndContinue)
  }

  verifyDefendantOrganisationDetails (): void {
    I.see('Defendant')
    I.see(verifyPageData.defendantOrganization)
    I.see('Mrs Orange')
    I.see(data.defendantTwoOrganisationNameText)
    I.see(data.removeButtonText)
    I.see(data.changeButtonText)
  }

  changeRemoveIndividualDefendantDetails (): void {
    I.waitForElement(fields.removeSecondDefendant)
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
