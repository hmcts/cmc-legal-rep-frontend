import { verifyPageData } from 'integration-test/data/legal-test-data'
import I = CodeceptJS.I

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
