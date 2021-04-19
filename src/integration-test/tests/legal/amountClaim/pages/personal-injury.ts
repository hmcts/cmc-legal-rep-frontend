import I = CodeceptJS.I

const I: I = actor()

const fields = {
  personalInjuryYes: { css: 'input[id=personal_injury_yes]' },
  personalInjuryNo: { css: 'input[id=personal_injury_no]' },
  generalDamagesLess: { css: 'input[id="generalDamages[value]LESS"]' },
  generalDamagesMore: { css: 'input[id="generalDamages[value]MORE"]' }
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimPersonalInjuryPage {

  open (): void {
    I.amOnLegalAppPage('/claim/personal-injury')
  }

  enterPersonalInjuryLessThan1000 (): void {
    I.waitForElement(fields.personalInjuryYes)
    I.checkOption(fields.personalInjuryYes)
    I.checkOption(fields.generalDamagesLess)
    I.click(buttons.saveAndContinue)
  }

  enterPersonalInjuryMoreThan1000 (): void {
    I.waitForElement(fields.personalInjuryYes)
    I.checkOption(fields.personalInjuryYes)
    I.checkOption(fields.generalDamagesMore)
    I.click(buttons.saveAndContinue)
  }

  noPersonalInjury (): void {
    I.waitForElement(fields.personalInjuryNo)
    I.checkOption(fields.personalInjuryNo)
    I.click(buttons.saveAndContinue)
  }

}
