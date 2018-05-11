import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  startNow: 'input.button.button-start'
}

export class ClaimantStartClaimPage {
  open (): void {
    I.amOnLegalAppPage('/claim/start')
  }

  startClaim (): void {
    I.click(buttons.startNow)
  }
}
