/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Address } from 'app/claims/models/address'
import { PartyType } from 'forms/../../../../../main/app/common/partyType'
import { ContactDetails } from 'claims/models/contactDetails'
import { Representative } from 'claims/models/representative'
import { TheirDetails } from 'claims/models/theirs/theirDetails'

describe('TheirDetails', () => {
  describe('constructor', () => {
    it('should set TheirDetails type fields to undefined', () => {
      let theirDetails = new TheirDetails()
      expect(theirDetails.name).to.be.undefined
      expect(theirDetails.address).to.be.undefined
      expect(theirDetails.type).to.be.undefined
      expect(theirDetails.representative).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a TheirDetails instance initialised with defaults for undefined', () => {
      expect(new TheirDetails().deserialize(undefined)).to.eql(new TheirDetails())
    })

    it('should return a TheirDetails instance initialised with defaults for null', () => {
      expect(new TheirDetails().deserialize(null)).to.eql(new TheirDetails())
    })

    it('should return a TheirDetails instance with set fields from given object', () => {
      const address = new Address('AddressLine1', 'AddressLine2', 'City', 'PostCode')
      const contactDetails = new ContactDetails('DX 123', 'me@email.com', '020810101010')
      const representative = new Representative('Org', address, contactDetails)

      const result = new TheirDetails().deserialize({
        type: PartyType.ORGANISATION.dataStoreValue,
        name: 'Tom',
        address: address,
        representative: representative
      })

      expect(result.type).to.be.equals(PartyType.ORGANISATION.dataStoreValue)
      expect(result.name).to.be.equals('Tom')
      expect(result.address).to.deep.equals(address)
      expect(result.representative).to.deep.equals(representative)
    })
  })

})
