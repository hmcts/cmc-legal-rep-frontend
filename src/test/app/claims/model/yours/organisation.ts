/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Address } from 'app/claims/models/address'
import { PartyType } from 'app/common/partyType'
import { Organisation } from 'claims/models/yours/organisation'

describe('Organisation', () => {
  describe('constructor', () => {
    it('should set organisation type fields to undefined', () => {
      let organisation = new Organisation()
      expect(organisation.name).to.be.undefined
      expect(organisation.companiesHouseNumber).to.be.undefined
      expect(organisation.address).to.be.undefined
      expect(organisation.type).to.eql(PartyType.ORGANISATION.dataStoreValue)
    })
  })

  describe('deserialize', () => {
    it('should return a Organisation instance initialised with defaults for undefined', () => {
      expect(new Organisation().deserialize(undefined)).to.eql(new Organisation())
    })

    it('should return a Organisation instance initialised with defaults for null', () => {
      expect(new Organisation().deserialize(null)).to.eql(new Organisation())
    })

    it('should return a Organisation instance with set fields from given object', () => {
      const address = new Address('AddressLine1', 'AddressLine2', 'City', 'PostCode')

      const result = new Organisation().deserialize({
        name: 'Tom',
        companiesHouseNumber: '12345678',
        address: address
      })

      expect(result.name).to.be.equals('Tom')
      expect(result.companiesHouseNumber).to.be.equals('12345678')
      expect(result.address).to.deep.equals(address)
    })
  })

})
