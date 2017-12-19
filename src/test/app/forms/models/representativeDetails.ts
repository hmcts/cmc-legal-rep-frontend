/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { RepresentativeDetails } from 'forms/models/representativeDetails'

describe('RepresentativeDetails', () => {

  describe('constructor', () => {
    it('should set the objects to undefined and set the cookie name', () => {
      const representativeDetails = new RepresentativeDetails()
      expect(representativeDetails.id).to.be.undefined
      expect(representativeDetails.organisationName).to.be.undefined
      expect(representativeDetails.address).to.be.undefined
      expect(representativeDetails.contactDetails).to.be.undefined
      expect(representativeDetails.feeAccount).to.be.undefined
      expect(representativeDetails.cookieName).to.eql('legalRepresentativeDetails')
    })
  })
})
