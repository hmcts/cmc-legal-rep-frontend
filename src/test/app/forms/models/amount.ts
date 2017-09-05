/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'
import { Amount, ValidationErrors } from 'app/forms/models/amount'

describe('Amount', () => {
  describe('constructor', () => {
    it('should set primitive type fields to undefined', () => {
      let amount = new Amount()
      expect(amount.cannotState).to.be.undefined
      expect(amount.lowerValue).to.be.undefined
      expect(amount.higherValue).to.be.undefined
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
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject amount with zero upper value', () => {
      const errors = validator.validateSync(new Amount(null, 0, ''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.HIGHER_VALUE_AMOUNT_NOT_VALID)
    })

    it('should reject amount with values undefined', () => {
      const errors = validator.validateSync(new Amount(null, undefined, undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.VALID_SELECTION_REQUIRED)
    })

    it('should reject amount with values null', () => {
      const errors = validator.validateSync(new Amount(null, null, null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.VALID_SELECTION_REQUIRED)
    })

    it('should reject amount with upper value greater than 9,999,999.99', () => {
      const errors = validator.validateSync(new Amount(null, 10000000, undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.HIGHER_VALUE_AMOUNT_NOT_VALID)
    })

    it('should reject amount with lower value greater than upper value', () => {
      const errors = validator.validateSync(new Amount(100, 10, undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.LOWER_VALUE_LESS_THAN_UPPER_NOT_VALID)
    })

    it('should accept amount with lower value equal to upper value', () => {
      const errors = validator.validateSync(new Amount(100, 100, undefined))

      expect(errors.length).to.equal(0)
    })

    it('should reject amount with values having more than two decimal spaces', () => {
      const errors = validator.validateSync(new Amount(12.123, 3435.32434, ''))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.AMOUNT_INVALID_DECIMALS)
    })

    it('should accept valid amount', () => {
      const errors = validator.validateSync(new Amount(100, 19090, ''))

      expect(errors.length).to.equal(0)
    })

    it('should reject all fields selections', () => {
      const errors = validator.validateSync(new Amount(100, 19090, Amount.CANNOT_STATE_VALUE))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.VALID_SELECTION_REQUIRED)
    })

    it('should reject Nan Upper value', () => {
      const errors = validator.validateSync(new Amount(100, Number.NaN, ''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.HIGHER_VALUE_AMOUNT_NOT_VALID)
    })

    it('should accept when upper value and lower value are null and cannot state is selected', () => {
      const errors = validator.validateSync(new Amount(null, null, Amount.CANNOT_STATE_VALUE))

      expect(errors.length).to.equal(0)
    })

    it('should accept when upper value and lower value are Nan and cannot state is selected', () => {
      const errors = validator.validateSync(new Amount(NaN, NaN, Amount.CANNOT_STATE_VALUE))

      expect(errors.length).to.equal(0)
    })
  })

  describe('fromObject', () => {

    it('should have amount elements undefined when input is undefined', () => {
      const amount = Amount.fromObject(undefined)

      expect(amount.cannotState).to.equal(undefined)
      expect(amount.lowerValue).to.equal(undefined)
      expect(amount.higherValue).to.equal(undefined)
    })

    it('should have amount elements undefined when input has undefined element value', () => {
      const amount = Amount.fromObject({
        cannotState: undefined,
        lowerValue: null,
        higherValue: undefined
      })

      expect(amount.cannotState).to.equal(undefined)
      expect(amount.lowerValue).to.equal(null)
      expect(amount.higherValue).to.equal(undefined)
    })

    it('should have valid amount details elements provided lower and uppr value', () => {
      const amount = Amount.fromObject({
        lowerValue: '500',
        higherValue: '10000'
      })

      expect(amount.cannotState).to.equal(undefined)
      expect(amount.lowerValue).to.equal(500)
      expect(amount.higherValue).to.equal(10000)
    })

    it('should have valid amount details elements provided cannot state value', () => {
      const amount = Amount.fromObject({
        cannotState: 'cannot'
      })

      expect(amount.cannotState).to.equal(Amount.CANNOT_STATE_VALUE)
      expect(amount.lowerValue).to.equal(null)
      expect(amount.higherValue).to.equal(undefined)
    })
  })
})
