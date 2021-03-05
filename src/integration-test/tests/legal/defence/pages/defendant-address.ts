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

export class DefendantAddressPage {
  open (): void {
    I.amOnLegalAppPage('/claim/defendant-address')
  }

  enterYourOrganisationAddress (): void {
    I.waitForElement(fields.addressLine1)
    I.fillField(fields.addressLine1, 'CMC T2 Defendant')
    I.fillField(fields.addressLine2, 'Westminster')
    I.fillField(fields.cityName, 'London')
    I.fillField(fields.postcode, 'SW1H 9BJ')
    I.click(buttons.saveAndContinue)
  }

  enterOnlyMandatoryDefendantOrganisationAddress (): void {
    I.waitForElement(fields.addressLine1)
    I.fillField(fields.addressLine1, 'CMC T2 Defendant')
    I.fillField(fields.cityName, 'London')
    I.fillField(fields.postcode, 'SW1H 9BJ')
    I.click(buttons.saveAndContinue)
  }
}
