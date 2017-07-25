/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { ContactDetails } from 'app/forms/models/contactDetails'
import Representative from 'drafts/models/representative'
import CompanyName from 'forms/models/companyName'
import { Address } from 'forms/models/address'

describe('Representative', () => {

  describe('constructor', () => {
    it('should set the fields to undefined', () => {
      const representative = new Representative()
      expect(representative.companyName).to.be.undefined
      expect(representative.contactDetails).to.be.undefined
      expect(representative.address).to.be.undefined
    })

  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for "undefined"', () => {
      expect(new Representative().deserialize(undefined)).to.eql(new Representative())
    })

    it('should return an instance initialised with defaults for "null"', () => {
      expect(new Representative().deserialize(null)).to.eql(new Representative())
    })

    it('should return am instance from given object', () => {
      const contactDetails = new ContactDetails('07555055505', 'email@example.com', 'any dx address')
      const companyName = new CompanyName( 'name' )
      const address = new Address('line1', 'line2', 'city', 'postcode')

      const deserialized = new Representative().deserialize({
        companyName: companyName,
        address: address,
        contactDetails: contactDetails
      })

      expect(deserialized).to.eql(new Representative(companyName, address, contactDetails))
    })
  })

})
