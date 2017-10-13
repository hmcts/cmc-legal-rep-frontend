/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Address } from 'app/claims/models/address'
import { Individual } from 'claims/models/theirs/individual'
import { PartyTypes } from 'forms/models/partyTypes'
import { ContactDetails } from 'claims/models/contactDetails'
import { Representative } from 'claims/models/representative'

describe('Individual', () => {
  describe('constructor', () => {
    it('should set individual type fields to undefined', () => {
      let individual = new Individual()
      expect(individual.name).to.be.undefined
      expect(individual.address).to.be.undefined
      expect(individual.type).to.eql(PartyTypes.INDIVIDUAL.dataStoreValue)
      expect(individual.representative).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Individual instance initialised with defaults for undefined', () => {
      expect(new Individual().deserialize(undefined)).to.eql(new Individual())
    })

    it('should return a Individual instance initialised with defaults for null', () => {
      expect(new Individual().deserialize(null)).to.eql(new Individual())
    })

    it('should return a Individual instance with set fields from given object', () => {
      const address = new Address('AddressLine1', 'AddressLine2', 'City', 'PostCode')
      const contactDetails = new ContactDetails('DX 123', 'me@email.com', '020810101010')
      const representative = new Representative('Org', address, contactDetails)

      const result = new Individual().deserialize({
        name: 'Tom',
        address: address,
        representative: representative
      })

      expect(result.name).to.be.equals('Tom')
      expect(result.address).to.deep.equals(address)
      expect(result.representative).to.deep.equals(representative)
    })
  })

})
