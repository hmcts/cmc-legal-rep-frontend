import I = CodeceptJS.I

const I: I = actor()

export class HomePage {
  open () {
    I.amOnLegalAppPage('/')
  }
}
