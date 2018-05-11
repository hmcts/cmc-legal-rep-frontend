import I = CodeceptJS.I

const I: I = actor()

const fields = {
  isAddClaimantYes: 'input[id=claimant_add_yes]',
  isAddClaimantNo: 'input[id=claimant_add_no]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimantAddPage {
  open (): void {
    I.amOnLegalAppPage('/claim/claimant-add')
  }

  enterAdditionalClaimant (): void {
    I.checkOption(fields.isAddClaimantYes)
    I.click(buttons.saveAndContinue)
  }

  chooseNoAdditionalClaimant (): void {
    I.checkOption(fields.isAddClaimantNo)
    I.click(buttons.saveAndContinue)
  }
}
