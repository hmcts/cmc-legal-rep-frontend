import { verifyPageData } from 'integration-test/data/legal-test-data'
import I = CodeceptJS.I

const I: I = actor()

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const expect = chai.expect

const buttons = {
  finish: 'input.button.button-start'
}

export class ClaimSubmittedPage {

  open (): void {
    I.amOnLegalAppPage('/claim/submitted')
  }

  verifyTextInSubmittedPage (dateCheck: string[]): void {
    I.see(verifyPageData.feesPaid)
    I.see(verifyPageData.emailConfirmation)
    // verify submit date text present or not
    expect(dateCheck[0].length).to.be.greaterThan(20)
    // verify issue date text present or not
    expect(dateCheck[1].length).to.be.greaterThan(17)
  }

  selectSubmitButton (): void {
    I.click(buttons.finish)
    I.see('start')
  }
}
