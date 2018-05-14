import I = CodeceptJS.I

const I: I = actor()

const fields = {
  organisationName: 'input[id=name]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

const data = {
  organisationNameText: 'Abc Organisation'
}

export class ClaimantRepresentativeNamePage {
  open (): void {
    I.amOnLegalAppPage('/claim/representative-name')
  }

  enterYourOrganisationName (): void {
    I.fillField(fields.organisationName, data.organisationNameText)
    I.click(buttons.saveAndContinue)
  }

  verifyOrganizationName (): void {
    I.seeInField(fields.organisationName, data.organisationNameText)
    I.click(buttons.saveAndContinue)
  }
}
