import I = CodeceptJS.I

const I: I = actor()

const fields = {
  lowerValue: { css: 'input[id=lowerValue]' },
  higherValue: { css: 'input[id=higherValue]' },
  cannotState: { css: 'input[id=cannotState]' }
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimAmountPage {

  open (): void {
    I.amOnLegalAppPage('/claim/amount')
  }

  enterHigherValueOfTheClaim (): void {
    I.waitForElement(fields.higherValue)
    I.fillField(fields.higherValue, '1000')
    I.click(buttons.saveAndContinue)
  }

  enterRangeOfTheClaim (): void {
    I.waitForElement(fields.higherValue)
    I.fillField(fields.lowerValue, '3000')
    I.fillField(fields.higherValue, '6000')
    I.click(buttons.saveAndContinue)
  }

  canNotStateTheClaim (): void {
    I.waitForElement(fields.cannotState)
    I.checkOption(fields.cannotState)
    I.click(buttons.saveAndContinue)
  }

}
