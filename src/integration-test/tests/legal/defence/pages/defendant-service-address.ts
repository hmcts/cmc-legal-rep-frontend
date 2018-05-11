import I = CodeceptJS.I

const I: I = actor()

const fields = {
  useDefendantsAddress: 'input[id=defendantsAddressYES]',
  useAnotherAddress: 'input[id=defendantsAddressNO]',
  addressLine1: 'input[id=line1]',
  addressLine2: 'input[id=line2]',
  cityName: 'input[id=city]',
  postcode: 'input[id=postcode]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class DefendantServiceAddressPage {
  open (): void {
    I.amOnLegalAppPage('/claim/defendant-service-address')
  }

  enterAnotherServiceAddress (): void {
    I.checkOption(fields.useAnotherAddress)
    I.fillField(fields.addressLine1, 'CMC T2')
    I.fillField(fields.addressLine2, 'Westminster')
    I.fillField(fields.cityName, 'London')
    I.fillField(fields.postcode, 'SW1H 9AJ')
    I.click(buttons.saveAndContinue)
  }

  useDefendantAddressAsServiceAddress (): void {
    I.checkOption(fields.useDefendantsAddress)
    I.see('CMC T2 DEFENDANT WESTMINSTER LONDON SW1H 9BJ')
    I.click(buttons.saveAndContinue)
  }
}
