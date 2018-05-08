import I = CodeceptJS.I

const I: I = actor()

const fields = {
  search: 'input[id=reference]'
}

const buttons = {
  searchButton: 'button#button.search-submit.icon.icon-search'
}

export class ClaimSearchPage {
  open () {
    I.amOnLegalAppPage('/dashboard/search')
  }

  searchForClaim (legalClaimNumber) {
    I.fillField(fields.search, legalClaimNumber)
    I.click(buttons.searchButton)
  }
}
