import I = CodeceptJS.I

const I: I = actor()

const fields = {
  isAddClaimantYes: { css: 'input[id=claimant_add_yes]' },
  isAddClaimantNo: { css: 'input[id=claimant_add_no]' }
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimantAddPage {
  open (): void {
    I.amOnLegalAppPage('/claim/claimant-add')
  }

  enterAdditionalClaimant (): void {
    I.waitForElement(fields.isAddClaimantYes)
    I.checkOption(fields.isAddClaimantYes)
    I.click(buttons.saveAndContinue)
  }

  chooseNoAdditionalClaimant (): void {
    I.waitForElement(fields.isAddClaimantNo)
    I.checkOption(fields.isAddClaimantNo)
    I.click(buttons.saveAndContinue)
  }
}
