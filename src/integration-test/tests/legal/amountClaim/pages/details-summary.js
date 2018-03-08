'use strict'
/* global actor */
const verifyPageData = require('../../../../data/legal-test-data').verifyPageData

let I

module.exports = {

  _init () {
    I = actor()
  },
  fields: {

  },
  buttons: {
    saveAndContinue: 'input.button'
  },

  open () {
    I.amOnLegalAppPage('/claim/details-summary')
  },

  verifyOrganizationDetails () {
    I.see('Your organisation details')
    I.see('Organisation name')
    I.see('Abc Organisation')
    I.see('Address')
    I.see('MOJ')
    I.see('WESTMINSTER')
    I.see('LONDON')
    I.see('SW1H 9AJ')
    I.see('Phone number')
    I.see('0700000000')
    I.see('Email')
    I.see('vivred@mailinator.com')
    I.see('DX address')
    I.see('DX123')
    I.see('Your reference number')
    I.see(verifyPageData.organizationRefNumber)
    I.see('Preferred court')
    I.see('Dartford County Court')
  },
  claimantDetails () {
    I.see('Claimant details')
    I.see('Organisation name')
    I.see(verifyPageData.claimantOrganization)
    I.see('Address')
    I.see('CMC T2')
    I.see('WESTMINSTER')
    I.see('LONDON')
    I.see('SW1H 9AJ')
  },

  multipleClaimantsDetails () {
    I.see('Claimant 1 details')
    I.see('Organisation name')
    I.see(verifyPageData.claimantOrganization)
    I.see('Address')
    I.see('CMC T2')
    I.see('WESTMINSTER')
    I.see('LONDON')
    I.see('SW1H 9AJ')
    I.see('Claimant 2 details')
    I.see('Name')
    I.see('Mr Benugo')
    I.see('Address')
    I.see('CMC T2')
    I.see('WESTMINSTER')
    I.see('LONDON')
    I.see('SW1H 9AJ')
  },
  defendantDetails () {
    I.see('Defendant details')
    I.see('Organisation name')
    I.see(verifyPageData.defendantOrganization)
    I.see('Companies House number')
    I.see('678910')
    I.see('Address')
    I.see('CMC T2 DEFENDANT')
    I.see('WESTMINSTER')
    I.see('LONDON')
    I.see('SW1H 9BJ')
  },
  aboutThisClaim () {
    I.see('About this claim')
    I.see('Brief details of claim')
    I.see('I would like to test this with codeceptjs')
    I.see('Claim amount')
    I.see('To be assessed')
    I.see('Statement of value')
    I.see('This claim is for personal injury. The claimant expects to recover not more than £1,000 as damages for pain, suffering and loss of amenity.')
    I.see('This is also a claim for housing disrepair which includes an order for the landlord to carry out work. The cost of repairs or other work is not more than £1,000. The cost of any claim for damages is not more than £1,000.')
    I.see('The claimant expects to recover up to £6,000. The claimant estimates the claim to be worth more than £3,000')
    I.see('Issue fee')
    I.see(verifyPageData.feesPaid)
  },
  individualClaimDetails () {
    I.see('Claimant details')
    I.see('Name')
    I.see('Mr Benugo')
    I.see('Address')
    I.see('CMC T2')
    I.see('WESTMINSTER')
    I.see('LONDON')
    I.see('SW1H 9AJ')
  },

  individualDefendantDetails () {
    I.see('Defendant details')
    I.see('Mr Pret')
    I.see('Address')
    I.see('CMC T2 DEFENDANT')
    I.see('WESTMINSTER')
    I.see('LONDON')
    I.see('SW1H 9BJ')
    I.scrollTo('#defendantDetails')
  },

  aboutThisClaimWithNoClaimValue () {
    I.see('About this claim')
    I.see('Brief details of claim')
    I.see('I would like to test this with codeceptjs')
    I.see('Claim amount')
    I.see('To be assessed')
    I.see('Statement of value')
    I.see('The claimant can\'t state the value of the claim.')
    I.see('Issue fee')
    I.see(verifyPageData.maxFeePaid)
  },
  selectSubmitButton () {
    I.click(this.buttons.saveAndContinue)
  }

}
