/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { ContactDetails } from 'claims/models/contactDetails'

describe('ContactDetails', () => {
  describe('constructor', () => {
    it('should set primitive type fields to undefined', () => {
      let contactDetails = new ContactDetails()
      expect(contactDetails.dxAddress).to.be.undefined
      expect(contactDetails.email).to.be.undefined
      expect(contactDetails.phoneNumber).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a ContactDetails instance initialised with defaults for undefined', () => {
      expect(new ContactDetails().deserialize(undefined)).to.eql(new ContactDetails())
    })

    it('should return a ContactDetails instance initialised with defaults for null', () => {
      expect(new ContactDetails().deserialize(null)).to.eql(new ContactDetails())
    })

    it('should return a ContactDetails instance with set fields from given object', () => {
      const result = new ContactDetails().deserialize({
        dxAddress: 'DX 123',
        email: 'me@email.com',
        phoneNumber: '020810101010'
      })

      expect(result.dxAddress).to.be.equals('DX 123')
      expect(result.email).to.be.equals('me@email.com')
      expect(result.phoneNumber).to.be.equals('020810101010')
    })
  })

})
