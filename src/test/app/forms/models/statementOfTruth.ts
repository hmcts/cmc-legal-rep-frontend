/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as randomstring from 'randomstring'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { StatementOfTruth, ValidationErrors } from 'forms/models/statementOfTruth'

describe('StatementOfTruth', () => {
  describe('constructor', () => {
    it('should set primitive type fields to undefined', () => {
      let statementOfTruth = new StatementOfTruth()
      expect(statementOfTruth.signerName).to.be.undefined
      expect(statementOfTruth.signerRole).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a statementOfTruth instance initialised with defaults for undefined', () => {
      expect(new StatementOfTruth().deserialize(undefined)).to.eql(new StatementOfTruth())
    })

    it('should return a statementOfTruth instance initialised with defaults for null', () => {
      expect(new StatementOfTruth().deserialize(null)).to.eql(new StatementOfTruth())
    })

    it('should return a statementOfTruth instance with set fields from given object', () => {
      const result = new StatementOfTruth().deserialize({
        signerName: 'signerName',
        signerRole: 'signerRole'
      })

      expect(result.signerName).to.be.equals('signerName')
      expect(result.signerRole).to.be.equals('signerRole')
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject statementOfTruth with empty elements', () => {
      const errors = validator.validateSync(new StatementOfTruth('', ''))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.SIGNER_NAME_REQUIRED)
      expectValidationError(errors, ValidationErrors.SIGNER_ROLE_REQUIRED)
    })

    it('should reject statementOfTruth with blank elements', () => {
      const errors = validator.validateSync(new StatementOfTruth(' ', ' '))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.SIGNER_NAME_REQUIRED)
      expectValidationError(errors, ValidationErrors.SIGNER_ROLE_REQUIRED)
    })

    it('should reject statementOfTruth with null elements', () => {
      const errors = validator.validateSync(new StatementOfTruth(null, null))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.SIGNER_NAME_REQUIRED)
      expectValidationError(errors, ValidationErrors.SIGNER_ROLE_REQUIRED)
    })

    it('should reject statementOfTruth with elements longer then upper limit', () => {
      const errors = validator.validateSync(new StatementOfTruth(randomstring.generate(71), randomstring.generate(256)))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
    })

    it('should accept valid statementOfTruth upto to upper limit', () => {
      const errors = validator.validateSync(new StatementOfTruth(randomstring.generate(70), randomstring.generate(255)))

      expect(errors.length).to.equal(0)
    })
  })

  describe('fromObject', () => {

    it('should have statementOfTruth elements undefined when input is undefined', () => {
      const statementOfTruth = StatementOfTruth.fromObject(undefined)

      expect(statementOfTruth.signerName).to.be.undefined
      expect(statementOfTruth.signerRole).to.be.undefined
    })

    it('should have statementOfTruthelement undefined when input has undefined element value', () => {
      const statementOfTruth = StatementOfTruth.fromObject({
        signerName: undefined,
        signerRole: undefined
      })

      expect(statementOfTruth.signerName).to.be.undefined
      expect(statementOfTruth.signerRole).to.be.undefined
    })

    it('should have valid statementOfTruth details elements', () => {
      const statementOfTruth = StatementOfTruth.fromObject({
        signerName: 'signerName',
        signerRole: 'signerRole'
      })

      expect(statementOfTruth.signerName).to.equal('signerName')
      expect(statementOfTruth.signerRole).to.equal('signerRole')

    })
  })
})
