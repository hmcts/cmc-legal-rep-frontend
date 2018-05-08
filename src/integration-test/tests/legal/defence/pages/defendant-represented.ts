import I = CodeceptJS.I

const I: I = actor()

const fields = {
  defendantRepresentedYes: 'input[id=defendant_represented_yes]',
  defendantRepresentedNo: 'input[id=defendant_represented_no]',
  companyName: 'input[id=organisationName]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class DefendantRepresentedPage {
  open () {
    I.amOnLegalAppPage('/claim/defendant-represented')
  }

  enterDefendantCompanyName () {
    I.checkOption(fields.defendantRepresentedYes)
    I.fillField(fields.companyName, 'Defendant Rep Ltd')
    I.click(buttons.saveAndContinue)
  }

  noDefendantCompanyName () {
    I.checkOption(fields.defendantRepresentedNo)
    I.click(buttons.saveAndContinue)
  }
}
