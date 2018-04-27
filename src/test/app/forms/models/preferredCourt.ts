/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from './validationUtils'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import PreferredCourt from 'forms/models/preferredCourt'

import * as randomstring from 'randomstring'

describe('PreferredCourt', () => {
  describe('constructor', () => {
    it('should return an instance', () => {
      let deserialized = new PreferredCourt().deserialize({})
      expect(deserialized).to.be.instanceof(PreferredCourt)
    })

    it('should return an instance initialised with defaults for "undefined"', () => {
      expect(new PreferredCourt().deserialize(undefined)).to.eql(new PreferredCourt())
    })

    it('should return an instance initialised with defaults for "null"', () => {
      expect(new PreferredCourt().deserialize(null)).to.eql(new PreferredCourt())
    })

    it('should return am instance from given object', () => {
      let deserialized = new PreferredCourt().deserialize({
        name: 'name'
      })

      expect(deserialized).to.eql(new PreferredCourt('name'))
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new PreferredCourt().deserialize(undefined)).to.eql(new PreferredCourt())
    })

    it('should return an instance initialised with defaults for null', () => {
      expect(new PreferredCourt().deserialize(null)).to.eql(new PreferredCourt())
    })

    it('should return an instance from given object', () => {
      const name = 'My Court'
      const result = new PreferredCourt().deserialize({
        name: name
      })
      expect(result.name).to.be.equals(name)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should accept court name with null type', () => {
      const errors = validator.validateSync(new PreferredCourt(null))

      expect(errors.length).to.equal(0)
    })

    it('should accept court name with empty string', () => {
      const errors = validator.validateSync(new PreferredCourt(''))

      expect(errors.length).to.equal(0)
    })

    it('should reject court name with more than 80 characters', () => {
      const errors = validator.validateSync(new PreferredCourt(randomstring.generate(81)))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
    })

    it('should accept court name with 80 characters', () => {
      const errors = validator.validateSync(new PreferredCourt(randomstring.generate(80)))
      expect(errors.length).to.equal(0)
    })

    it('should accept valid court name', () => {
      const errors = validator.validateSync(new PreferredCourt('My Court Name'))

      expect(errors.length).to.equal(0)
    })
  })

  describe('fromObject', () => {

    it('should have preferred court element undefined when input is undefined', () => {
      const preferredCourt = PreferredCourt.fromObject(undefined)

      expect(preferredCourt.name).to.equal(undefined)
    })

    it('should have preferred court element empty when input has empty value', () => {
      const preferredCourt = PreferredCourt.fromObject({ name: '' })

      expect(preferredCourt.name).to.equal('')
    })

    it('should have valid preferred court element', () => {
      const input = randomstring.generate(80)
      const preferredCourt = PreferredCourt.fromObject({
        name: input
      })

      expect(preferredCourt.name).to.equal(input)
    })
  })

})
