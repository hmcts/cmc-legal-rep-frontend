/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as randomstring from 'randomstring'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { ServiceAddress } from 'forms/models/serviceAddress'
import { YesNo } from 'forms/models/yesNo'

describe('Service Address', () => {
  describe('constructor', () => {
    it('should set primitive type fields to undefined', () => {
      let serviceAddress = new ServiceAddress()
      expect(serviceAddress.defendantsAddress).to.be.undefined
      expect(serviceAddress.line1).to.be.undefined
      expect(serviceAddress.line2).to.be.undefined
      expect(serviceAddress.city).to.be.undefined
      expect(serviceAddress.postcode).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Service Address instance initialised with defaults for undefined', () => {
      expect(new ServiceAddress().deserialize(undefined)).to.eql(new ServiceAddress())
    })

    it('should return a Service Address instance initialised with defaults for null', () => {
      expect(new ServiceAddress().deserialize(null)).to.eql(new ServiceAddress())
    })

    it('should return a Service Address instance with set fields from given object', () => {
      const result = new ServiceAddress().deserialize({
        defendantsAddress: 'NO',
        line1: 'AddressLine1',
        line2: 'AddressLine2',
        city: 'City',
        postcode: 'SW1H 9AJ'
      })

      expect(result.defendantsAddress).to.be.equals('NO')
      expect(result.line1).to.be.equals('AddressLine1')
      expect(result.line2).to.be.equals('AddressLine2')
      expect(result.city).to.be.equals('City')
      expect(result.postcode).to.be.equals('SW1H 9AJ')
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject address with empty first address line, town and postcode', () => {
      const errors = validator.validateSync(new ServiceAddress(YesNo.NO, '', '', '', ''))

      expect(errors.length).to.equal(3)
      expectValidationError(errors, CommonValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, CommonValidationErrors.CITY_REQUIRED)
      expectValidationError(errors, CommonValidationErrors.POSTCODE_REQUIRED)
    })

    it('should reject address with blank first address line, town and postcode', () => {
      const errors = validator.validateSync(new ServiceAddress(YesNo.NO, ' ', '', ' ', ' '))

      expect(errors.length).to.equal(3)
      expectValidationError(errors, CommonValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, CommonValidationErrors.CITY_REQUIRED)
      expectValidationError(errors, CommonValidationErrors.POSTCODE_REQUIRED)
    })

    it('should reject address with first line longer then upper limit', () => {
      const errors = validator.validateSync(new ServiceAddress(YesNo.NO, randomstring.generate(101), '', 'town', 'SW1H 9AJ'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
    })

    it('should reject address with second line longer then upper limit', () => {
      const errors = validator.validateSync(new ServiceAddress(YesNo.NO, 'Apartment 99', randomstring.generate(101), 'town', 'SW1H 9AJ'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
    })

    it('should reject address with city longer then upper limit', () => {
      const errors = validator.validateSync(new ServiceAddress(YesNo.NO, 'Apartment 99', '', randomstring.generate(61), 'SW1H 9AJ'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
    })

    it('should reject address with invalid postcode', () => {
      const errors = validator.validateSync(new ServiceAddress(YesNo.NO, 'Apartment 99', '', 'town', '123456789'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.POSTCODE_INVALID)
    })

    it('should accept valid service address', () => {
      const errors = validator.validateSync(new ServiceAddress(YesNo.NO, 'Apartment 99', '', 'London', 'SW1H 9AJ'))

      expect(errors.length).to.equal(0)
    })

    it('should accept use defendants address option', () => {
      const errors = validator.validateSync(new ServiceAddress(YesNo.YES))

      expect(errors.length).to.equal(0)
    })
  })

  describe('fromObject', () => {

    it('should have address elements undefined when input is undefined', () => {
      const address = ServiceAddress.fromObject(undefined)

      expect(address.defendantsAddress).to.equal(undefined)
      expect(address.line1).to.equal(undefined)
      expect(address.line2).to.equal(undefined)
      expect(address.city).to.equal(undefined)
      expect(address.postcode).to.equal(undefined)
    })

    it('should have address elements undefined when input has undefined element value', () => {
      const address = ServiceAddress.fromObject({
        defendantsAddress: undefined,
        line1: undefined,
        line2: undefined,
        city: undefined,
        postcode: undefined
      })

      expect(address.defendantsAddress).to.equal(undefined)
      expect(address.line1).to.equal(undefined)
      expect(address.line2).to.equal(undefined)
      expect(address.city).to.equal(undefined)
      expect(address.postcode).to.equal(undefined)
    })

    it('should have valid service address details elements', () => {
      const address = ServiceAddress.fromObject({
        defendantsAddress: YesNo.NO.value,
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'SW1H 9AJ'
      })

      expect(address.defendantsAddress).to.equal(YesNo.NO)
      expect(address.line1).to.equal('LINE1')
      expect(address.line2).to.equal('LINE2')
      expect(address.city).to.equal('CITY')
      expect(address.postcode).to.equal('SW1H 9AJ')
    })
  })
})
