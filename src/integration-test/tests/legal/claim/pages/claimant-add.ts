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
  open () {
    I.amOnLegalAppPage('/claim/claimant-add')
  }

  enterAdditionalClaimant () {
    I.checkOption(fields.isAddClaimantYes)
    I.click(buttons.saveAndContinue)
  }

  chooseNoAdditionalClaimant () {
    I.checkOption(fields.isAddClaimantNo)
    I.click(buttons.saveAndContinue)
  }
}
