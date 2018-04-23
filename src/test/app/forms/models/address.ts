/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as randomstring from 'randomstring'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { Address } from 'forms/models/address'

describe('Address', () => {
  describe('constructor', () => {
    it('should set primitive type fields to undefined', () => {
      let address = new Address()
      expect(address.line1).to.be.undefined
      expect(address.line2).to.be.undefined
      expect(address.city).to.be.undefined
      expect(address.postcode).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Address instance initialised with defaults for undefined', () => {
      expect(new Address().deserialize(undefined)).to.eql(new Address())
    })

    it('should return a Address instance initialised with defaults for null', () => {
      expect(new Address().deserialize(null)).to.eql(new Address())
    })

    it('should return a Address instance with set fields from given object', () => {
      const result = new Address().deserialize({
        line1: 'AddressLine1',
        line2: 'AddressLine2',
        city: 'City',
        postcode: 'PostCode'
      })

      expect(result.line1).to.be.equals('AddressLine1')
      expect(result.line2).to.be.equals('AddressLine2')
      expect(result.city).to.be.equals('City')
      expect(result.postcode).to.be.equals('PostCode')
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject address with empty first address line, town and postcode', () => {
      const errors = validator.validateSync(new Address('', '', '', ''))

      expect(errors.length).to.equal(3)
      expectValidationError(errors, CommonValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, CommonValidationErrors.CITY_REQUIRED)
      expectValidationError(errors, CommonValidationErrors.POSTCODE_REQUIRED)
    })

    it('should reject address with blank first address line, town and postcode', () => {
      const errors = validator.validateSync(new Address(' ', '', ' ', ' '))

      expect(errors.length).to.equal(3)
      expectValidationError(errors, CommonValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, CommonValidationErrors.CITY_REQUIRED)
      expectValidationError(errors, CommonValidationErrors.POSTCODE_REQUIRED)
    })

    it('should reject address with first line longer then upper limit', () => {
      const errors = validator.validateSync(new Address(randomstring.generate(101), '', 'town', 'SW1A 1AA'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
    })

    it('should reject address with second line longer then upper limit', () => {
      const errors = validator.validateSync(new Address('Apartment 99', randomstring.generate(101), 'town', 'SW1A 1AA'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
    })

    it('should reject address with city longer then upper limit', () => {
      const errors = validator.validateSync(new Address('Apartment 99', '', randomstring.generate(61), 'SW1A 1AA'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
    })

    it('should reject address with postcode is invalid', () => {
      const errors = validator.validateSync(new Address('Apartment 99', '', 'town', 'invalid pst'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.POSTCODE_INVALID)
    })

    it('should accept valid address', () => {
      const errors = validator.validateSync(new Address('Apartment 99', '', 'London', 'SW1A 1AA'))

      expect(errors.length).to.equal(0)
    })
  })

  describe('fromObject', () => {

    it('should have address elements undefined when input is undefined', () => {
      const address = Address.fromObject(undefined)

      expect(address.line1).to.equal(undefined)
      expect(address.line2).to.equal(undefined)
      expect(address.city).to.equal(undefined)
      expect(address.postcode).to.equal(undefined)
    })

    it('should have address elements undefined when input has undefined element value', () => {
      const address = Address.fromObject({
        line1: undefined,
        line2: undefined,
        city: undefined,
        postcode: undefined
      })

      expect(address.line1).to.equal(undefined)
      expect(address.line2).to.equal(undefined)
      expect(address.city).to.equal(undefined)
      expect(address.postcode).to.equal(undefined)
    })

    it('should have valid address details elements', () => {
      const address = Address.fromObject({
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'sw1a 1aa'
      })

      expect(address.line1).to.equal('LINE1')
      expect(address.line2).to.equal('LINE2')
      expect(address.city).to.equal('CITY')
      expect(address.postcode).to.equal('SW1A 1AA')
    })
  })

  describe('toString', () => {

    it('should return an address in one string', () => {
      const address = Address.fromObject({
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'sw1a 1aa'
      }).toString()

      expect(address).to.equal('LINE1 LINE2 CITY SW1A 1AA')
    })

  })
})
