/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from './validationUtils'
import Summary, { ValidationErrors } from 'forms/models/summary'
import * as randomstring from 'randomstring'

describe('Reason', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const reason = new Summary()
      expect(reason.summary).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new Summary().deserialize(undefined)).to.eql(new Summary())
    })

    it('should return an instance initialised with defaults for null', () => {
      expect(new Summary().deserialize(null)).to.eql(new Summary())
    })

    it('should return an instance from given object', () => {
      const description = 'I am owed money 300'
      const result = new Summary().deserialize({
        summary: description
      })
      expect(result.summary).to.be.equals(description)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject claim summary with undefined reason', () => {
      const errors = validator.validateSync(new Summary(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.SUMMARY_REQUIRED)
    })

    it('should reject claim summary with null type', () => {
      const errors = validator.validateSync(new Summary(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.SUMMARY_REQUIRED)
    })

    it('should reject claim summary with empty string', () => {
      const errors = validator.validateSync(new Summary(''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.SUMMARY_REQUIRED)
    })

    it('should reject claim summary with white spaces string', () => {
      const errors = validator.validateSync(new Summary('   '))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.SUMMARY_REQUIRED)
    })

    it('should reject claim summary with more than 700 characters', () => {
      const errors = validator.validateSync(new Summary(randomstring.generate(701)))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.SUMMARY_TOO_LONG.replace('$constraint1', '700'))
    })

    it('should accept claim summary with 700 characters', () => {
      const errors = validator.validateSync(new Summary(randomstring.generate(700)))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid claim reason', () => {
      const errors = validator.validateSync(new Summary('i am owed money £300'))

      expect(errors.length).to.equal(0)
    })

  })
})
