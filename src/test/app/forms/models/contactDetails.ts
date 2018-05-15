/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ContactDetails, ValidationErrors } from 'forms/models/contactDetails'

import * as randomstring from 'randomstring'

describe('ContactDetails', () => {

  describe('constructor', () => {
    it('should have the primitive fields set to undefined', () => {
      let contactDetails = new ContactDetails()
      expect(contactDetails.phoneNumber).to.be.undefined
      expect(contactDetails.email).to.be.undefined
      expect(contactDetails.dxAddress).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return an instance initialised with defaults given undefined', () => {
      expect(new ContactDetails().deserialize(undefined)).to.eql(new ContactDetails())
    })

    it('should return an instance initialised with defaults when given null', () => {
      expect(new ContactDetails().deserialize(null)).to.eql(new ContactDetails())
    })

    it('should return an instance with set fields from given object', () => {
      let result = new ContactDetails().deserialize({
        email: 'email@example.com',
        phoneNumber: '+447123456789',
        dxAddress: 'any address'
      })
      expect(result).to.deep.eq(new ContactDetails('+447123456789', 'email@example.com', 'any address'))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should accepts undefined phone number, email and dxAddress', () => {
      const errors = validator.validateSync(new ContactDetails(undefined, undefined, undefined))
      expect(errors.length).to.equal(0)
    })

    it('should accepts valid mobile number, email and dxAddress', () => {
      const errors = validator.validateSync(new ContactDetails('07555055505', 'email@example.com', 'any dx address'))
      expect(errors.length).to.equal(0)
    })

    it('should accepts valid phone number, email and dxAddress', () => {
      const errors = validator.validateSync(new ContactDetails('01269055505', 'email@example.com', randomstring.generate(255)))
      expect(errors.length).to.equal(0)
    })

    it('should accepts valid 9 digit phone number', () => {
      const errors = validator.validateSync(new ContactDetails('0890555051', 'email@example.com', 'any dx address'))
      expect(errors.length).to.equal(0)
    })

    it('should accepts valid 7 digit phone number', () => {
      const errors = validator.validateSync(new ContactDetails('08905550', 'email@example.com', 'any dx address'))
      expect(errors.length).to.equal(0)
    })

    it('should reject invalid phone number', () => {
      const errors = validator.validateSync(new ContactDetails('00911269055505', 'email@example.com', 'any dx address'))
      expect(errors.length).to.equal(1)
    })

    it('should reject empty string for phone number', () => {
      const errors = validator.validateSync(new ContactDetails('', 'email@example.com', 'any dx address'))
      expect(errors.length).to.equal(1)
    })

    it('should reject dx address greater than 255', () => {
      const errors = validator.validateSync(new ContactDetails('01269055505', 'email@example.com', randomstring.generate(256)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DX_ADDRESS_TOO_LONG)
    })

    it('should reject invalid email address', () => {
      const errors = validator.validateSync(new ContactDetails('01269055505', 'email.example.com', randomstring.generate(255)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.EMAIL_NOT_VALID)
    })

    it('should reject invalid email address with missing domain', () => {
      const errors = validator.validateSync(new ContactDetails('01269055505', 'email@example', randomstring.generate(255)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.EMAIL_NOT_VALID)
    })

    it('should reject invalid email address which is whitespace', () => {
      const errors = validator.validateSync(new ContactDetails('01269055505', ' ', randomstring.generate(255)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.EMAIL_NOT_VALID)
    })
  })

  describe('fromObject', () => {

    it('should have contact details elements undefined when input is undefined', () => {
      const contactDetails = ContactDetails.fromObject(undefined)

      expect(contactDetails.phoneNumber).to.equal(undefined)
      expect(contactDetails.email).to.equal(undefined)
      expect(contactDetails.dxAddress).to.equal(undefined)
    })

    it('should have contact details elements undefined when input has invalid element value', () => {
      const contactDetails = ContactDetails.fromObject({ personalInjury: {}, generalDamages: {} })

      expect(contactDetails.phoneNumber).to.equal(undefined)
      expect(contactDetails.email).to.equal(undefined)
      expect(contactDetails.dxAddress).to.equal(undefined)
    })

    it('should have valid contact details elements', () => {
      let dxAddress = randomstring.generate(255)

      const contactDetails = ContactDetails.fromObject({
        phoneNumber: '01269055505',
        email: 'email.example.com',
        dxAddress: dxAddress
      })

      expect(contactDetails.phoneNumber).to.equal('01269055505')
      expect(contactDetails.email).to.equal('email.example.com')
      expect(contactDetails.dxAddress).to.equal(dxAddress)
    })
  })
})
