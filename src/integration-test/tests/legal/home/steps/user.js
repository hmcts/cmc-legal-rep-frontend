'use strict'

const DEFAULT_PASSWORD = require('../../../../data/test-data').DEFAULT_PASSWORD

let loginPage, startClaimPage, yourOrganisationNamePage, yourOrganisationAddressPage, yourContactDetailsPage,
  yourReferencePage, yourCountyCourtPage, claimantTypePage, claimantAddressPage, claimantAddPage

module.exports = {

  _init () {
    loginPage = require('../pages/login')
    startClaimPage = require('../../claim/pages/claimant-start-claim')
    yourOrganisationNamePage = require('../../claim/pages/claimant-representative-name')
    yourOrganisationAddressPage = require('../../claim/pages/claimant-representative-address')
    yourContactDetailsPage = require('../../claim/pages/claimant-representative-contacts')
    yourReferencePage = require('../../claim/pages/claimant-reference')
    yourCountyCourtPage = require('../../claim/pages/claimant-preferred-court')
    claimantTypePage = require('../../claim/pages/claimant-type')
    claimantAddressPage = require('../../claim/pages/claimant-address')
    claimantAddPage = require('../../claim/pages/claimant-add')
  },
  loginUser (userEmail, password) {
    loginPage.open()
    loginPage.login(userEmail, password || DEFAULT_PASSWORD)
  },
  startClaim () {
    startClaimPage.open()
    startClaimPage.startClaim()
  },
  loginAndStartClaim (userEmail, password) {
    this.loginUser(userEmail, password)
    this.startClaim()
  },

  enterYourOrganisationNamePage () {
    yourOrganisationNamePage.enterYourOrganisationName()
  },
  enterYourOrganisationAddress () {
    yourOrganisationAddressPage.enterYourOrganisationAddress()
  },
  enterYourOrganisationContactDetails () {
    yourContactDetailsPage.enterYourOrganisationContactDetails()
  },
  enterYourReferenceNumber () {
    yourReferencePage.enterYourReferenceForClaim()
  },
  enterYourPreferredCountyCourt () {
    yourCountyCourtPage.enterYourPreferredCountyCourt()
  },
  enterClaimantServiceDetails () {
    yourOrganisationNamePage.enterYourOrganisationName()
    yourOrganisationAddressPage.enterYourOrganisationAddress()
    yourContactDetailsPage.enterYourOrganisationContactDetails()
    yourReferencePage.enterYourReferenceForClaim()
    yourCountyCourtPage.enterYourPreferredCountyCourt()
  },
  enterMandatoryClaimantServiceDetails () {
    yourOrganisationNamePage.enterYourOrganisationName()
    yourOrganisationAddressPage.enterOnlyMandatoryOrganisationAddress()
    yourContactDetailsPage.submitOnlyMandatoryData()
    yourReferencePage.submitOnlyMandatoryData()
    yourCountyCourtPage.submitOnlyMandatoryData()
    claimantTypePage.enterOnlyMandatoryClaimantTypeData()
  },
  enterMandatoryClaimantAddressDetails () {
    claimantAddressPage.enterMandatoryClaimantOrganisationAddress()
  },
  enterClaimantTypeIndividual () {
    claimantTypePage.enterClaimantTypeIndividual()
  },
  enterClaimantTypeOrganisation () {
    claimantTypePage.enterClaimantTypeOrganisation()
  },
  enterClaimantAddress () {
    claimantAddressPage.enterYourOrganisationAddress()
  },
  addAdditionalClaimant () {
    claimantAddPage.enterAdditionalClaimant()
  },
  noAdditionalClaimant () {
    claimantAddPage.chooseNoAdditionalClaimant()
  },
  verifyOrganizationDetails () {
    yourOrganisationNamePage.verifyOrganizationName()
    yourOrganisationAddressPage.verifyOrganizationAddress()
    yourContactDetailsPage.verifyContactDetails()
  },
  verifyAndChangeClaimantDetails () {
    claimantTypePage.verifyClaimantIndividualDetails()
    claimantTypePage.changeRemoveIndividualClaimantDetails()
  }
}
