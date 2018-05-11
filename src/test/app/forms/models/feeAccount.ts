/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { FeeAccount, ValidationErrors } from 'forms/models/feeAccount'

describe('FeeAccount', () => {

  describe('constructor', () => {
    it('should set the primitive fields to undefined', () => {
      const feeAccount = new FeeAccount()
      expect(feeAccount.reference).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults for undefined', () => {
      expect(new FeeAccount().deserialize(undefined)).to.eql(new FeeAccount())
    })

    it('should return an instance initialised with defaults for null', () => {
      expect(new FeeAccount().deserialize(null)).to.eql(new FeeAccount())
    })

    it('should return an instance from given object', () => {
      const reference = 'PBA1234567'
      const result = new FeeAccount().deserialize({
        reference: reference
      })
      expect(result.reference).to.be.equals(reference)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject fee account with undefined', () => {
      const errors = validator.validateSync(new FeeAccount(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FEE_ACCOUNT_REQUIRED)
    })

    it('should reject fee account with null type', () => {
      const errors = validator.validateSync(new FeeAccount(null))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FEE_ACCOUNT_REQUIRED)
    })

    it('should reject fee account with empty string', () => {
      const errors = validator.validateSync(new FeeAccount(''))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FEE_ACCOUNT_REQUIRED)
    })

    it('should reject fee account with white spaces string', () => {
      const errors = validator.validateSync(new FeeAccount('   '))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FEE_ACCOUNT_REQUIRED)
    })

    it('should reject fee account with invalid format', () => {
      const errors = validator.validateSync(new FeeAccount('abc1234567'))
      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FEE_ACCOUNT_INVALID)
    })

    it('should accept valid fee account', () => {
      const errors = validator.validateSync(new FeeAccount('PBA1234567'))

      expect(errors.length).to.equal(0)
    })

  })

  describe('fromObject', () => {

    it('should have undefined when input is undefined', () => {
      const feeAccount = FeeAccount.fromObject(undefined)

      expect(feeAccount).to.equal(undefined)
    })

    it('should have valid fee account', () => {
      const feeAccount = FeeAccount.fromObject({
        reference: 'PBA1234567'
      })
      expect(feeAccount.reference).to.equal('PBA1234567')
    })
  })

})
