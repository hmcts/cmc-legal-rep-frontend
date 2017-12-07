/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { PartyType as ClaimantTypes } from 'forms/../../../../main/app/common/partyType'
import { ClaimantDetails, ValidationErrors } from 'app/forms/models/claimantDetails'
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
        type: ClaimantTypes.INDIVIDUAL,
        title: 'title',
        fullName: 'full name',
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(deserialized).to.eql(new ClaimantDetails(ClaimantTypes.INDIVIDUAL, 'title', 'full name', undefined, undefined))
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
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.INDIVIDUAL, 'title', 'full name', undefined, undefined))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject claimant details for claimant type when individual details are undefined', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.INDIVIDUAL, undefined, undefined, undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should reject claimant details for claimant type when individual details are null', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.INDIVIDUAL, null, null, undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should reject claimant details for claimant type when individual details are empty', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.INDIVIDUAL, '', '', undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should accept claimant details for organisation type when organisation details are valid', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.ORGANISATION, undefined, undefined, 'organisation name', '12345678'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject claimant details for organisation type when organisation name is null', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.ORGANISATION, undefined, undefined, null, '12345678'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.ORGANISATION_NAME_REQUIRED)
      })
    })

    it('should reject claimant details for organisation type when organisation name is undefined', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.ORGANISATION, undefined, undefined, undefined, '12345678'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.ORGANISATION_NAME_REQUIRED)
      })
    })

    it('should reject claimant details for organisation type when organisation name length is more than 255', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.ORGANISATION,
          undefined, undefined, randomstring.generate(256), '12345678'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept claimant details for organisation type when organisation name length is 255', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.ORGANISATION,
          undefined, undefined, randomstring.generate(255), '12345678'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject claimant details for organisation type when companyHouseNumber length is more than 8', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.ORGANISATION,
          undefined, undefined, 'organisation', randomstring.generate(9)))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept claimant details for organisation type when companyHouseNumber length is 8', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.ORGANISATION,
          undefined, undefined, 'organisation', randomstring.generate(8)))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject claimant details for claimant type when full name length is more than 70', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.INDIVIDUAL,
          'title', randomstring.generate(71), undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should reject claimant details for claimant type when title length is more than 35', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.INDIVIDUAL,
          randomstring.generate(36), 'fullname', undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept claimant details for claimant type when fullName length is 70', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.INDIVIDUAL,
          'title', randomstring.generate(70), undefined, undefined))

        expect(errors.length).to.equal(0)
      })
    })

    it('should accept claimant details for claimant type when title length is 35', () => {
      ClaimantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantDetails(ClaimantTypes.INDIVIDUAL,
          randomstring.generate(35), 'fullName', undefined, undefined))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject', () => {

    it('should have claimant details elements undefined when input is undefined', () => {
      const claimantDetails = ClaimantDetails.fromObject(undefined)

      expect(claimantDetails.type).to.equal(undefined)
      expect(claimantDetails.title).to.equal(undefined)
      expect(claimantDetails.fullName).to.equal(undefined)
      expect(claimantDetails.organisation).to.equal(undefined)
      expect(claimantDetails.companyHouseNumber).to.equal(undefined)
    })

    it('should have claimant details elements undefined when input has undefined element value', () => {
      const claimantDetails = ClaimantDetails.fromObject({
        type: undefined,
        title: undefined,
        fullName: undefined,
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(claimantDetails.type).to.equal(undefined)
      expect(claimantDetails.title).to.equal(undefined)
      expect(claimantDetails.fullName).to.equal(undefined)
      expect(claimantDetails.organisation).to.equal(undefined)
      expect(claimantDetails.companyHouseNumber).to.equal(undefined)
    })

    it('should have valid claimant details elements', () => {
      const claimantDetails = ClaimantDetails.fromObject({
        type: 'INDIVIDUAL',
        title: 'title',
        fullName: 'full name',
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(claimantDetails.type).to.eql(ClaimantTypes.INDIVIDUAL)
      expect(claimantDetails.title).to.equal('title')
      expect(claimantDetails.fullName).to.equal('full name')
      expect(claimantDetails.organisation).to.equal(undefined)
      expect(claimantDetails.companyHouseNumber).to.equal(undefined)
    })
  })

  describe('toString', () => {

    it('should have claimant details elements undefined when input is undefined', () => {
      const claimantDetails = ClaimantDetails.fromObject({
        type: 'INDIVIDUAL',
        title: 'title',
        fullName: 'full name',
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(claimantDetails.toString()).to.equal('title full name')
    })
  })
})
