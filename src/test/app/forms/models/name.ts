/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from './validationUtils'
import Name, { ValidationErrors } from 'forms/models/name'
import * as randomstring from 'randomstring'

describe('Name', () => {

  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const organisationName = new Name()
      expect(organisationName.text).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new Name().deserialize(undefined)).to.eql(new Name())
    })

    it('should return an instance initialised with defaults for null', () => {
      expect(new Name().deserialize(null)).to.eql(new Name())
    })

    it('should return an instance from given object', () => {
      const name = 'My Company Name'
      const result = new Name().deserialize({
        text: name
      })
      expect(result.text).to.be.equals(name)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject name with undefined', () => {
      const errors = validator.validateSync(new Name(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NAME_REQUIRED)
    })

    it('should reject name with null type', () => {
      const errors = validator.validateSync(new Name(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NAME_REQUIRED)
    })

    it('should reject name with empty string', () => {
      const errors = validator.validateSync(new Name(''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NAME_REQUIRED)
    })

    it('should reject name with white spaces string', () => {
      const errors = validator.validateSync(new Name('   '))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NAME_REQUIRED)
    })

    it('should reject name with more than 255 characters', () => {
      const errors = validator.validateSync(new Name(randomstring.generate(256)))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.NAME_TOO_LONG)
    })

    it('should accept name with 255 characters', () => {
      const errors = validator.validateSync(new Name(randomstring.generate(255)))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid name', () => {
      const errors = validator.validateSync(new Name('Claimant Name'))

      expect(errors.length).to.equal(0)
    })

  })
})
