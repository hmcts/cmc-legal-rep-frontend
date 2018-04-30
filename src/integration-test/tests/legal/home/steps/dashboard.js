'use strict'

let dashboardSearchPage, dashboardClaimDetailsPage
module.exports = {
  _init () {
    dashboardSearchPage = require('../../dashboard/pages/claimSearch')
    dashboardClaimDetailsPage = require('../../dashboard/pages/claim-details')
  },

  openPage () {
    dashboardSearchPage.open()
    dashboardClaimDetailsPage.open()
  },
  searchAndVerifyClaimDetails (legalClaimNumberText) {
    const extractClaimNumber = legalClaimNumberText.split(' ').pop()
    dashboardSearchPage.open()
    dashboardSearchPage.searchForClaim(extractClaimNumber)
    dashboardClaimDetailsPage.verifyClaimDetails(extractClaimNumber)
  }

}
