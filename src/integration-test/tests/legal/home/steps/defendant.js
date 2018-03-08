'use strict'

let defendantTypePage, defendantAddressPage, defendantRepresentativePage, defendantRepresentativeAddressPage, defendantAddAnotherDefendantPage, defendantServiceAddressPage

module.exports = {
  _init () {
    defendantTypePage = require('../../defence/pages/defendant-type')
    defendantAddressPage = require('../../defence/pages/defendant-address')
    defendantRepresentativePage = require('../../defence/pages/defendant-represented')
    defendantRepresentativeAddressPage = require('../../defence/pages/defendant-reps-address')
    defendantAddAnotherDefendantPage = require('../../defence/pages/defendant-add')
    defendantServiceAddressPage = require('../../defence/pages/defendant-service-address')
  },

  enterDefendantTypeIndividual () {
    defendantTypePage.enterDefendantTypeIndividual()
  },

  enterDefendantTypeOrganisation () {
    defendantTypePage.enterDefendantTypeOrganisation()
  },

  enterMandatoryDefendantDetails () {
    defendantTypePage.enterOnlyMandatoryDefendantTypeDetails()
    defendantAddressPage.enterOnlyMandatoryDefendantOrganisationAddress()
  },

  enterAnotherDefendantTypeIndividual () {
    defendantTypePage.enterAnotherDefendantTypeIndividual()
  },

  enterAnotherDefendantTypeOrganisation () {
    defendantTypePage.enterAnotherDefendantTypeOrganisation()
  },

  enterDefendantAddress () {
    defendantAddressPage.enterYourOrganisationAddress()
  },

  enterDefendantRepsCompanyName () {
    defendantRepresentativePage.enterDefendantCompanyName()
  },

  noDefendantCompanyName () {
    defendantRepresentativePage.noDefendantCompanyName()
  },

  enterDefendantRepsAddress () {
    defendantRepresentativeAddressPage.enterDefendantRepsCompanyAddress()
  },

  enterAnotherDefendant () {
    defendantAddAnotherDefendantPage.enterAnotherDefendant()
  },

  noAnotherDefendant () {
    defendantAddAnotherDefendantPage.noAnotherDefendant()
  },

  enterServiceAddress () {
    defendantServiceAddressPage.enterAnotherServiceAddress()
  },

  defendantAddressAsServiceAddress () {
    defendantServiceAddressPage.useDefendantAddressAsServiceAddress()
  },
  verifyAndChangeDefendantDetails () {
    defendantTypePage.verifyDefendantOrganisationDetails()
    defendantTypePage.changeRemoveIndividualDefendantDetails()
  }
}
