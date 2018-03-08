'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },

  fields: {
    username: '#username',
    password: '#password'
  },
  buttons: {
    submit: 'input[type=submit]'
  },

  open () {
    I.amOnLegalAppPage('/')
  },

  login (email, password) {
    I.fillField(this.fields.username, email)
    I.fillField(this.fields.password, password)
    I.click(this.buttons.submit)
  }
}
