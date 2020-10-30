/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { YourReference } from 'forms/models/yourReference'

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

    it.only('should throw error if empty string is provided for reference', () => {
      const errors = validator.validateSync(new YourReference(''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, 'Enter your reference for this claim')
    })

    it('should reject reference with too many characters', () => {
      const errors = validator.validateSync(new YourReference('This reference is too long to accept'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
    })

    it('should accept valid reference', () => {
      const errors = validator.validateSync(new YourReference('Acceptable reference'))

      expect(errors.length).to.equal(0)
    })
  })

  describe('fromObject', () => {

    it('should have YourReference undefined when input is undefined', () => {
      const reference = YourReference.fromObject(undefined)

      expect(reference).to.equal(undefined)
    })

    it('should have valid YourReference text', () => {
      const yourReference = YourReference.fromObject({
        reference: 'REF123'
      })
      expect(yourReference.reference).to.equal('REF123')
    })
  })

})
