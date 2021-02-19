import I = CodeceptJS.I

const I: I = actor()

const fields = {
  defendantRepresentedYes: { css: 'input[id=defendant_represented_yes]' },
  defendantRepresentedNo: { css: 'input[id=defendant_represented_no]' },
  companyName: { css: 'input[id=organisationName]' }
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class DefendantRepresentedPage {
  open (): void {
    I.amOnLegalAppPage('/claim/defendant-represented')
  }

  enterDefendantCompanyName (): void {
    I.waitForElement(fields.defendantRepresentedYes)
    I.checkOption(fields.defendantRepresentedYes)
    I.fillField(fields.companyName, 'Defendant Rep Ltd')
    I.click(buttons.saveAndContinue)
  }

  noDefendantCompanyName (): void {
    I.waitForElement(fields.defendantRepresentedNo)
    I.checkOption(fields.defendantRepresentedNo)
    I.click(buttons.saveAndContinue)
  }
}
