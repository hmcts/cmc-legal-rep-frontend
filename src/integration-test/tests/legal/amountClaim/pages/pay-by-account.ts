import I = CodeceptJS.I
const verifyPageData = require('../../../../data/legal-test-data').verifyPageData

const I: I = actor()

const fields = {
  feeAccountReference: 'input[id=reference]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimPayByAccountPage {

  open (): void {
    I.amOnLegalAppPage('/claim/pay-by-account')
  }

  enterFeeAccountNumber () {
    I.see(verifyPageData.feesPaid)
    I.fillField(fields.feeAccountReference, verifyPageData.feeAccountNumber)
    I.click(buttons.saveAndContinue)
  }
}
