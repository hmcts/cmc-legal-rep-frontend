/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Address } from 'app/claims/models/address'
import { ContactDetails } from 'claims/models/contactDetails'
import { Representative } from 'claims/models/representative'
import { Claimant } from 'claims/models/yours/claimant'
import { ClaimantName } from 'forms/models/claimantName'

describe('Claimant', () => {
  describe('constructor', () => {
    it('should set Claimant type fields to undefined', () => {
      let party = new Claimant()
      expect(party.name).to.be.undefined
      expect(party.address).to.be.undefined
      expect(party.representative).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Claimant instance initialised with defaults for undefined', () => {
      expect(new Claimant().deserialize(undefined)).to.eql(new Claimant())
    })

    it('should return a Claimant instance initialised with defaults for null', () => {
      expect(new Claimant().deserialize(null)).to.eql(new Claimant())
    })

    it('should return a Claimant instance with set fields from given object', () => {
      const claimantName = new ClaimantName('Tom')
      const address = new Address('AddressLine1', 'AddressLine2', 'City', 'PostCode')
      const contactDetails = new ContactDetails('DX 123', 'me@email.com', '020810101010')
      const representative = new Representative('Org', address, contactDetails)

      const result = new Claimant().deserialize({
        name: claimantName,
        address: address,
        representative: representative
      })

      expect(result.name.value).to.deep.equals('Tom')
      expect(result.address).to.deep.equals(address)
      expect(result.representative).to.deep.equals(representative)
    })
  })

})
