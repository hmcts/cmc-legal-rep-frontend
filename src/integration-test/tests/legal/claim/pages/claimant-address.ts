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

export class ClaimantAddressPage {
  open (): void {
    I.amOnLegalAppPage('/claim/claimant-address')
  }

  enterYourOrganisationAddress (): void {
    I.fillField(fields.addressLine1, 'CMC T2')
    I.fillField(fields.addressLine2, 'Westminster')
    I.fillField(fields.cityName, 'London')
    I.fillField(fields.postcode, 'SW1H 9AJ')
    I.click(buttons.saveAndContinue)
  }

  enterMandatoryClaimantOrganisationAddress (): void {
    I.fillField(fields.addressLine1, 'CMC T2')
    I.fillField(fields.cityName, 'London')
    I.fillField(fields.postcode, 'SW1H 9AJ')
    I.click(buttons.saveAndContinue)
  }
}
