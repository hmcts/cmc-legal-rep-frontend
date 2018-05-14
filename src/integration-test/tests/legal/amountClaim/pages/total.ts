import { verifyPageData } from 'integration-test/data/legal-test-data'
import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimTotalPage {

  open (): void {
    I.amOnLegalAppPage('/claim/total')
  }

  checkFeeTotalForRange (): void {
    I.see('Issue fee (based on £6,000 higher value)')
    I.see(verifyPageData.feesPaid)
    I.click(buttons.saveAndContinue)
  }

  checkFeeTotalForCanNotStateValue (): void {
    I.see('Issue fee (no higher value given)')
    I.see(verifyPageData.maxFeePaid)
    I.click(buttons.saveAndContinue)
  }
}
