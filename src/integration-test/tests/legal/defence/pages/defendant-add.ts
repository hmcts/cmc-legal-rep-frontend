import I = CodeceptJS.I

const I: I = actor()

const fields = {
  defendantAddYes: { css: 'input[id=defendant_add_yes]' },
  defendantAddNo: { css: 'input[id=defendant_add_no]' }
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class DefendantAddPage {
  open (): void {
    I.amOnLegalAppPage('/claim/defendant-add')
  }

  enterAnotherDefendant (): void {
    I.waitForElement(fields.defendantAddYes)
    I.checkOption(fields.defendantAddYes)
    I.click(buttons.saveAndContinue)
  }

  noAnotherDefendant (): void {
    I.waitForElement(fields.defendantAddNo)
    I.checkOption(fields.defendantAddNo)
    I.click(buttons.saveAndContinue)
  }
}
