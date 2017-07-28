import { expect } from 'chai'
import { Address } from 'forms/models/address'
import Claimant from 'app/drafts/models/claimant'
import Name from 'app/forms/models/name'

describe('Claimant', () => {
  describe('constructor', () => {
    it('should have instance fields initialised', () => {
      let claimant = new Claimant()
      expect(claimant.address).to.be.instanceof(Address)
      expect(claimant.name).to.be.instanceof(Name)
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
      const name = new Name('individual name')
      const address = new Address('line1', 'line2', 'city', 'postcode')

      const claimant = new Claimant().deserialize({
        address: { line1: 'line1', line2: 'line2', city: 'city', postcode: 'postcode' },
        name: { text: 'individual name' }
      })

      expect(claimant.address).to.deep.eq(address)
      expect(claimant.name).to.deep.eq(name)
    })
  })
})
