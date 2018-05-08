import I = CodeceptJS.I

const I: I = actor()

const fields = {
  addressLine1: 'input[id=line1]',
  addressLine2: 'input[id=line2]',
  cityName: 'input[id=city]',
  postcode: 'input[id=postcode]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class DefendantAddressPage {
  open () {
    I.amOnLegalAppPage('/claim/defendant-address')
  }

  enterYourOrganisationAddress () {
    I.fillField(fields.addressLine1, 'CMC T2 Defendant')
    I.fillField(fields.addressLine2, 'Westminster')
    I.fillField(fields.cityName, 'London')
    I.fillField(fields.postcode, 'SW1H 9BJ')
    I.click(buttons.saveAndContinue)
  }

  enterOnlyMandatoryDefendantOrganisationAddress () {
    I.fillField(fields.addressLine1, 'CMC T2 Defendant')
    I.fillField(fields.cityName, 'London')
    I.fillField(fields.postcode, 'SW1H 9BJ')
    I.click(buttons.saveAndContinue)
  }
}
