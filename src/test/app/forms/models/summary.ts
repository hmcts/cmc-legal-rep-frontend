/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from './validationUtils'
import Summary, { ValidationErrors } from 'app/forms/models/summary'

import * as randomstring from 'randomstring'

describe('Summary', () => {
  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const summary = new Summary()
      expect(summary.summary).to.be.undefined
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
      const summary = 'summary'
      const result = new Summary().deserialize({
        summary: summary
      })
      expect(result.summary).to.be.equals(summary)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject summary with null type', () => {
      const errors = validator.validateSync(new Summary(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject summary with empty string', () => {
      const errors = validator.validateSync(new Summary(''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.REASON_REQUIRED)
    })

    it('should reject summary with more than 99000 characters', () => {
      const errors = validator.validateSync(new Summary(randomstring.generate(99001)))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, 'Enter reason no longer than 99000 characters')
    })

    it('should accept summary with 99000 characters', () => {
      const errors = validator.validateSync(new Summary(randomstring.generate(99000)))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid summary', () => {
      const errors = validator.validateSync(new Summary('My Court Name'))

      expect(errors.length).to.equal(0)
    })
  })
})
