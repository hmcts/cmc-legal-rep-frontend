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

const data = {
  addressLine1Text: 'Moj',
  addressLine2Text: 'Westminster',
  cityNameText: 'London',
  postcodeText: 'SW1H 9AJ',
  verifyAddressLine1Text: 'MOJ',
  verifyAddressLine2Text: 'WESTMINSTER',
  verifyCityNameText: 'LONDON'
}

export class ClaimantRepresentativeAddressPage {
  open (): void {
    I.amOnLegalAppPage('/claim/representative-address')
  }

  enterYourOrganisationAddress (): void {
    I.fillField(fields.addressLine1, data.addressLine1Text)
    I.fillField(fields.addressLine2, data.addressLine2Text)
    I.fillField(fields.cityName, data.cityNameText)
    I.fillField(fields.postcode, data.postcodeText)
    I.click(buttons.saveAndContinue)
  }

  verifyOrganizationAddress (): void {
    I.seeInField(fields.addressLine1, data.verifyAddressLine1Text)
    I.seeInField(fields.addressLine2, data.verifyAddressLine2Text)
    I.seeInField(fields.cityName, data.verifyCityNameText)
    I.seeInField(fields.postcode, data.postcodeText)
    I.click(buttons.saveAndContinue)
  }

  enterOnlyMandatoryOrganisationAddress (): void {
    I.fillField(fields.addressLine1, data.addressLine1Text)
    I.fillField(fields.cityName, data.cityNameText)
    I.fillField(fields.postcode, data.postcodeText)
    I.click(buttons.saveAndContinue)
  }
}
