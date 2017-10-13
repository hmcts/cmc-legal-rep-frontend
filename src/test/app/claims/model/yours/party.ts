/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Address } from 'app/claims/models/address'
import { PartyTypes } from 'forms/models/partyTypes'
import { ContactDetails } from 'claims/models/contactDetails'
import { Representative } from 'claims/models/representative'
import { Party } from 'claims/models/yours/party'

describe('Party', () => {
  describe('constructor', () => {
    it('should set Party type fields to undefined', () => {
      let party = new Party()
      expect(party.name).to.be.undefined
      expect(party.address).to.be.undefined
      expect(party.type).to.be.undefined
      expect(party.representative).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Party instance initialised with defaults for undefined', () => {
      expect(new Party().deserialize(undefined)).to.eql(new Party())
    })

    it('should return a Party instance initialised with defaults for null', () => {
      expect(new Party().deserialize(null)).to.eql(new Party())
    })

    it('should return a Party instance with set fields from given object', () => {
      const address = new Address('AddressLine1', 'AddressLine2', 'City', 'PostCode')
      const contactDetails = new ContactDetails('DX 123', 'me@email.com', '020810101010')
      const representative = new Representative('Org', address, contactDetails)

      const result = new Party().deserialize({
        type: PartyTypes.ORGANISATION.dataStoreValue,
        name: 'Tom',
        address: address,
        representative: representative
      })

      expect(result.type).to.be.equals(PartyTypes.ORGANISATION.dataStoreValue)
      expect(result.name).to.be.equals('Tom')
      expect(result.address).to.deep.equals(address)
      expect(result.representative).to.deep.equals(representative)
    })
  })

})
