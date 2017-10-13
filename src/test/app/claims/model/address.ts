/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Address } from 'app/claims/models/address'

describe('Address', () => {
  describe('constructor', () => {
    it('should set primitive type fields to undefined', () => {
      let address = new Address()
      expect(address.line1).to.be.undefined
      expect(address.line2).to.be.undefined
      expect(address.city).to.be.undefined
      expect(address.postcode).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Address instance initialised with defaults for undefined', () => {
      expect(new Address().deserialize(undefined)).to.eql(new Address())
    })

    it('should return a Address instance initialised with defaults for null', () => {
      expect(new Address().deserialize(null)).to.eql(new Address())
    })

    it('should return a Address instance with set fields from given object', () => {
      const result = new Address().deserialize({
        line1: 'AddressLine1',
        line2: 'AddressLine2',
        city: 'City',
        postcode: 'PostCode'
      })

      expect(result.line1).to.be.equals('AddressLine1')
      expect(result.line2).to.be.equals('AddressLine2')
      expect(result.city).to.be.equals('City')
      expect(result.postcode).to.be.equals('PostCode')
    })
  })

})
