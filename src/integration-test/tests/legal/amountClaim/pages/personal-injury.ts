import I = CodeceptJS.I

const I: I = actor()

const fields = {
  personalInjuryYes: 'input[id=personal_injury_yes]',
  personalInjuryNo: 'input[id=personal_injury_no]',
  generalDamagesLess: 'input[id="generalDamages[value]LESS"]',
  generalDamagesMore: 'input[id="generalDamages[value]MORE"]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimPersonalInjuryPage {

  open (): void {
    I.amOnLegalAppPage('/claim/personal-injury')
  }

  enterPersonalInjuryLessThan1000 (): void {
    I.checkOption(fields.personalInjuryYes)
    I.checkOption(fields.generalDamagesLess)
    I.click(buttons.saveAndContinue)
  }

  enterPersonalInjuryMoreThan1000 (): void {
    I.checkOption(fields.personalInjuryYes)
    I.checkOption(fields.generalDamagesMore)
    I.click(buttons.saveAndContinue)
  }

  noPersonalInjury (): void {
    I.checkOption(fields.personalInjuryNo)
    I.click(buttons.saveAndContinue)
  }

}
