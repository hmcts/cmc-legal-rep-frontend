'use strict'
/* global actor */

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {
    search: 'input[id=reference]'
  },
  buttons: {
    searchButton: 'button#button.search-submit.icon.icon-search'
  },

  open () {
    I.amOnLegalAppPage('/dashboard/search')
  },
  searchForClaim (legalClaimNumber) {
    I.fillField(this.fields.search, legalClaimNumber)
    I.click(this.buttons.searchButton)
  }
}
