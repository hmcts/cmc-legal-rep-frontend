import I = CodeceptJS.I

const I: I = actor()

const fields = {
  lowerValue: 'input[id=lowerValue]',
  higherValue: 'input[id=higherValue]',
  cannotState: 'input[id=cannotState]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimAmountPage {

  open (): void {
    I.amOnLegalAppPage('/claim/amount')
  }

  enterHigherValueOfTheClaim (): void {
    I.fillField(fields.higherValue, '1000')
    I.click(buttons.saveAndContinue)
  }

  enterRangeOfTheClaim (): void {
    I.fillField(fields.lowerValue, '3000')
    I.fillField(fields.higherValue, '6000')
    I.click(buttons.saveAndContinue)
  }

  canNotStateTheClaim (): void {
    I.checkOption(fields.cannotState)
    I.click(buttons.saveAndContinue)
  }

}
