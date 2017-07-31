import { expect } from 'chai'
import { Address } from 'forms/models/address'
import Claimant from 'app/drafts/models/claimant'
import { ClaimantDetails } from 'app/forms/models/claimantDetails'
import { PartyTypes } from 'app/forms/models/partyTypes'

describe('Claimant', () => {
  describe('constructor', () => {
    it('should have instance fields initialised', () => {
      let claimant = new Claimant()
      expect(claimant.address).to.be.instanceof(Address)
      expect(claimant.claimantDetails).to.be.instanceof(ClaimantDetails)
    })
  })

  describe('deserialize', () => {
    it('should return a Claimant instance initialised with defaults for undefined', () => {
      expect(new Claimant().deserialize(undefined)).to.eql(new Claimant())
    })

    it('should return a Claimant instance initialised with defaults for null', () => {
      expect(new Claimant().deserialize(null)).to.eql(new Claimant())
    })

    it('should return an instance from given object', () => {
      const address = new Address('line1', 'line2', 'city', 'postcode')
      const claimantDetails = new ClaimantDetails(PartyTypes.INDIVIDUAL, 'title', 'full name')

      const claimant = new Claimant().deserialize({
        address: { line1: 'line1', line2: 'line2', city: 'city', postcode: 'postcode' },
        claimantDetails: {
          type: { value: 'INDIVIDUAL', displayValue: 'An individual' },
          title: 'title',
          fullName: 'full name',
          organisation: undefined,
          companyHouseNumber: undefined
        }
      })

      expect(claimant.address).to.deep.eq(address)
      expect(claimant.claimantDetails).to.deep.eq(claimantDetails)
    })
  })
})
