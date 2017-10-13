/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { ContactDetails } from 'claims/models/contactDetails'
import { Representative } from 'claims/models/representative'
import { Address } from 'claims/models/address'

describe('Representative', () => {
  describe('constructor', () => {
    it('should set fields to undefined', () => {
      const representative = new Representative()
      expect(representative.organisationName).to.be.undefined
      expect(representative.organisationAddress).to.be.undefined
      expect(representative.organisationContactDetails).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Representative instance initialised with defaults for undefined', () => {
      expect(new Representative().deserialize(undefined)).to.eql(new Representative())
    })

    it('should return a Representative instance initialised with defaults for null', () => {
      expect(new Representative().deserialize(null)).to.eql(new Representative())
    })

    it('should return a Representative instance with set fields from given object', () => {
      const address = new Address('AddressLine1', 'AddressLine2', 'City', 'PostCode')
      const contactDetails = new ContactDetails('DX 123', 'me@email.com', '020810101010')

      const result = new Representative().deserialize({
        organisationName: 'Org',
        organisationAddress: address,
        organisationContactDetails: contactDetails
      })

      expect(result.organisationName).to.be.equals('Org')
      expect(result.organisationAddress).to.deep.equal(address)
      expect(result.organisationContactDetails).to.deep.equals(contactDetails)
    })
  })

})
