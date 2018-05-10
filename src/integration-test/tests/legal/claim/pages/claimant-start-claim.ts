import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  startNow: 'input.button.button-start'
}

export class ClaimantStartClaimPage {
  open () {
    I.amOnLegalAppPage('/claim/start')
  }

  startClaim () {
    I.click(buttons.startNow)
  }
}
