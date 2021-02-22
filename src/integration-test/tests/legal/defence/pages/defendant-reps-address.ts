import I = CodeceptJS.I

const I: I = actor()

const fields = {
  addressLine1: { css: 'input[id=line1]' },
  addressLine2: { css: 'input[id=line2]' },
  cityName: { css: 'input[id=city]' },
  postcode: { css: 'input[id=postcode]' }
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class DefendantRepsAddressPage {
  open (): void {
    I.amOnLegalAppPage('/claim/defendant-reps-address')
  }

  enterDefendantRepsCompanyAddress (): void {
    I.waitForElement(fields.addressLine1)
    I.fillField(fields.addressLine1, 'CMC T2 Defendant Reps')
    I.fillField(fields.addressLine2, 'Westminster')
    I.fillField(fields.cityName, 'London')
    I.fillField(fields.postcode, 'SW1H 9CJ')
    I.click(buttons.saveAndContinue)
  }
}
