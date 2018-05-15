import I = CodeceptJS.I

const I: I = actor()

const fields = {
  courtName: 'input[id=name]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimantPreferredCourtPage {
  open (): void {
    I.amOnLegalAppPage('/claim/preferred-court')
  }

  enterYourPreferredCountyCourt (): void {
    I.fillField(fields.courtName, 'Dartford County Court')
    I.click(buttons.saveAndContinue)
  }

  submitOnlyMandatoryData (): void {
    I.click(buttons.saveAndContinue)
  }
}
