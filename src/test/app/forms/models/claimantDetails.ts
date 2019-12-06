/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { PartyType as ClaimantType } from 'common/partyType'
import { ClaimantDetails, ValidationErrors } from 'forms/models/claimantDetails'
import * as randomstring from 'randomstring'

describe('Claimant Details', () => {
  describe('deserialize', () => {
    it('should return an instance', () => {
      let deserialized = new ClaimantDetails().deserialize({})
      expect(deserialized).to.be.instanceof(ClaimantDetails)
    })

    it('should return an instance initialised with defaults for "undefined"', () => {
      expect(new ClaimantDetails().deserialize(undefined)).to.eql(new ClaimantDetails())
    })

    it('should return an instance initialised with defaults for "null"', () => {
      expect(new ClaimantDetails().deserialize(null)).to.eql(new ClaimantDetails())
    })

    it('should return am instance from given object', () => {
      let deserialized = new ClaimantDetails().deserialize({
        type: ClaimantType.INDIVIDUAL,
        fullName: 'full name',
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(deserialized).to.eql(new ClaimantDetails(ClaimantType.INDIVIDUAL, 'full name', undefined, undefined))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject claimant details for undefined type', () => {
      const errors = validator.validateSync(new ClaimantDetails(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CLAIMANT_TYPE_REQUIRED)
    })

    it('should accept claimant details for claimant type when individual details are valid', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.INDIVIDUAL, 'full name', undefined, undefined))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject claimant details for claimant type when individual details are undefined', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.INDIVIDUAL, undefined, undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should reject claimant details for claimant type when individual details are null', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.INDIVIDUAL, null, undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should reject claimant details for claimant type when individual details are empty', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.INDIVIDUAL, '', undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should accept claimant details for organisation type when organisation details are valid', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.ORGANISATION, undefined, 'organisation name', '12345678'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject claimant details for organisation type when organisation name is null', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.ORGANISATION, undefined, null, '12345678'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.ORGANISATION_NAME_REQUIRED)
      })
    })

    it('should reject claimant details for organisation type when organisation name is undefined', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.ORGANISATION, undefined, undefined, '12345678'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.ORGANISATION_NAME_REQUIRED)
      })
    })

    it('should reject claimant details for organisation type when organisation name length is more than 255', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.ORGANISATION,
          undefined, randomstring.generate(256), '12345678'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept claimant details for organisation type when organisation name length is 255', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.ORGANISATION,
          undefined, randomstring.generate(255), '12345678'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject claimant details for organisation type when companyHouseNumber length is more than 8', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.ORGANISATION,
          undefined, 'organisation', randomstring.generate(9)))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept claimant details for organisation type when companyHouseNumber length is 8', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.ORGANISATION,
          undefined, 'organisation', randomstring.generate(8)))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject claimant details for claimant type when full name length is more than 70', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.INDIVIDUAL,
          randomstring.generate(71), undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept claimant details for claimant type when fullName length is 70', () => {
      ClaimantType.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantType.INDIVIDUAL,
              randomstring.generate(70), undefined, undefined))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject', () => {

    it('should have claimant details elements undefined when input is undefined', () => {
      const claimantDetails = ClaimantDetails.fromObject(undefined)

      expect(claimantDetails.type).to.equal(undefined)
      expect(claimantDetails.fullName).to.equal(undefined)
      expect(claimantDetails.organisation).to.equal(undefined)
      expect(claimantDetails.companyHouseNumber).to.equal(undefined)
    })

    it('should have claimant details elements undefined when input has undefined element value', () => {
      const claimantDetails = ClaimantDetails.fromObject({
        type: undefined,
        fullName: undefined,
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(claimantDetails.type).to.equal(undefined)
      expect(claimantDetails.fullName).to.equal(undefined)
      expect(claimantDetails.organisation).to.equal(undefined)
      expect(claimantDetails.companyHouseNumber).to.equal(undefined)
    })

    it('should have valid claimant details elements', () => {
      const claimantDetails = ClaimantDetails.fromObject({
        type: 'INDIVIDUAL',
        fullName: 'full name',
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(claimantDetails.type).to.eql(ClaimantType.INDIVIDUAL)
      expect(claimantDetails.fullName).to.equal('full name')
      expect(claimantDetails.organisation).to.equal(undefined)
      expect(claimantDetails.companyHouseNumber).to.equal(undefined)
    })
  })

  describe('toString', () => {

    it('should have claimant details elements undefined when input is undefined', () => {
      const claimantDetails = ClaimantDetails.fromObject({
        type: 'INDIVIDUAL',
        fullName: 'full name',
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(claimantDetails.toString()).to.equal('full name')
    })
  })
})
