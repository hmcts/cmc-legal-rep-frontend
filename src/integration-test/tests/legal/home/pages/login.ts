import I = CodeceptJS.I

const I: I = actor()

const fields = {
  username: '#username',
  password: '#password'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class LoginPage {
  open () {
    I.amOnLegalAppPage('/')
  }

  login (email, password) {
    I.fillField(fields.username, email)
    I.fillField(fields.password, password)
    I.click(buttons.submit)
  }
}
