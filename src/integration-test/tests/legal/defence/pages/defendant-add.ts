import I = CodeceptJS.I

const I: I = actor()

const fields = {
  defendantAddYes: 'input[id=defendant_add_yes]',
  defendantAddNo: 'input[id=defendant_add_no]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class DefendantAddPage {
  open () {
    I.amOnLegalAppPage('/claim/defendant-add')
  }

  enterAnotherDefendant () {
    I.checkOption(fields.defendantAddYes)
    I.click(buttons.saveAndContinue)
  }

  noAnotherDefendant () {
    I.checkOption(fields.defendantAddNo)
    I.click(buttons.saveAndContinue)
  }
}
