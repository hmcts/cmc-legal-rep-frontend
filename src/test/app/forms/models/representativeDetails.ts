/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { RepresentativeDetails } from 'forms/models/representativeDetails'
import { Address } from 'forms/models/address'
import { ContactDetails } from 'forms/models/contactDetails'
import { FeeAccount } from 'forms/models/feeAccount'
import { OrganisationName } from 'forms/models/organisationName'

describe('RepresentativeDetails', () => {

  describe('constructor', () => {
    it('should set the objects to default values', () => {
      const representativeDetails = new RepresentativeDetails()
      expect(representativeDetails.organisationName).to.eql( new OrganisationName())
      expect(representativeDetails.address).to.eql(new Address())
      expect(representativeDetails.contactDetails).to.eql( new ContactDetails())
      expect(representativeDetails.feeAccount).to.eql(new FeeAccount())
      expect(representativeDetails.cookieName).to.eql('legalRepresentativeDetails')
    })
  })
})
