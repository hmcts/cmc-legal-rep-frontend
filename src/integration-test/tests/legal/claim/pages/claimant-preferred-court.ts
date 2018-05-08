import I = CodeceptJS.I

const I: I = actor()

const fields = {
  courtName: 'input[id=name]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimantPreferredCourtPage {
  open () {
    I.amOnLegalAppPage('/claim/preferred-court')
  }

  enterYourPreferredCountyCourt () {
    I.fillField(fields.courtName, 'Dartford County Court')
    I.click(buttons.saveAndContinue)
  }

  submitOnlyMandatoryData () {
    I.click(buttons.saveAndContinue)
  }
}
