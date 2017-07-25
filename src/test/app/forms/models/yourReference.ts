/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { YourReference, ValidationErrors } from 'forms/models/yourReference'

describe('YourReference', () => {

  describe('constructor', () => {
    it('should have the primitive field set to undefined', () => {
      let yourReference = new YourReference()
      expect(yourReference.reference).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a YourReference instance initialised with defaults given undefined', () => {
      expect(new YourReference().deserialize(undefined)).to.eql(new YourReference())
    })

    it('should return a YourReference instance initialised with defaults when given null', () => {
      expect(new YourReference().deserialize(null)).to.eql(new YourReference())
    })

    it('should return a ClaimReference instance with set fields from given object', () => {
      let result = new YourReference().deserialize({
        reference: 'JUL2017'
      })
      expect(result.reference).to.equal('JUL2017')
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should accept reference with null ', () => {
      const errors = validator.validateSync(new YourReference(null))

      expect(errors.length).to.equal(0)
    })

    it('should accept empty string for reference', () => {
      const errors = validator.validateSync(new YourReference(''))

      expect(errors.length).to.equal(0)
    })

    it('should reject reference with too many characters', () => {
      const errors = validator.validateSync(new YourReference('This reference is too long to accept'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.YOUR_REFERENCE_TOO_LONG)
    })

    it('should accept valid reference', () => {
      const errors = validator.validateSync(new YourReference('Acceptable reference'))

      expect(errors.length).to.equal(0)
    })
  })
})
