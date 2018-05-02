/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Amount } from 'claims/models/amount'

describe('Amount', () => {
  describe('constructor', () => {
    it('should set primitive type fields to undefined', () => {
      let amount = new Amount()
      expect(amount.cannotState).to.be.undefined
      expect(amount.lowerValue).to.be.undefined
      expect(amount.higherValue).to.be.undefined
      expect(amount.type).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Amount instance initialised with defaults for undefined', () => {
      expect(new Amount().deserialize(undefined)).to.eql(new Amount())
    })

    it('should return a Amount instance initialised with defaults for null', () => {
      expect(new Amount().deserialize(null)).to.eql(new Amount())
    })

    it('should return a Amount instance with set fields from given object', () => {
      let amount = new Amount().deserialize({
        cannotState: undefined,
        lowerValue: 1212.12,
        higherValue: 12332.21
      })

      expect(amount.cannotState).to.be.undefined
      expect(amount.lowerValue).to.be.equal(1212.12)
      expect(amount.higherValue).to.be.equal(12332.21)
      expect(amount.type).to.be.equal('range')
    })
  })

})
