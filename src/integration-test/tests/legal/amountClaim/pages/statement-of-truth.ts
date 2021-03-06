import I = CodeceptJS.I

const I: I = actor()

const fields = {
  signerName: 'input[id=signerName]',
  signerRole: 'input[id=signerRole]'
}

const buttons = {
  saveAndContinue: 'input[type=submit]'
}

export class ClaimStatementOfTruthPage {

  open (): void {
    I.amOnLegalAppPage('/claim/statement-of-truth')
  }

  enterStatementOfTruthSignerNameAndRole (): void {
    I.waitForElement(fields.signerName)
    I.fillField(fields.signerName, 'vivred')
    I.fillField(fields.signerRole, 'QA')
    I.see('Abc Organisation')
    I.scrollTo(buttons.saveAndContinue)
    I.wait(1)
    I.waitForEnabled(buttons.saveAndContinue)
    I.click(buttons.saveAndContinue)
  }

}
