/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { PartyType as DefendantType } from 'app/common/partyType'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { DefendantDetails, ValidationErrors } from 'app/forms/models/defendantDetails'
import * as randomstring from 'randomstring'

describe('Defendant Details', () => {
  describe('deserialize', () => {
    it('should return an instance', () => {
      let deserialized = new DefendantDetails().deserialize({})
      expect(deserialized).to.be.instanceof(DefendantDetails)
    })

    it('should return an instance initialised with defaults for "undefined"', () => {
      expect(new DefendantDetails().deserialize(undefined)).to.eql(new DefendantDetails())
    })

    it('should return an instance initialised with defaults for "null"', () => {
      expect(new DefendantDetails().deserialize(null)).to.eql(new DefendantDetails())
    })

    it('should return am instance from given object', () => {
      let deserialized = new DefendantDetails().deserialize({
        type: DefendantType.INDIVIDUAL,
        fullName: 'full name',
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(deserialized).to.eql(new DefendantDetails(DefendantType.INDIVIDUAL, 'full name', undefined, undefined))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject defendant details for undefined type', () => {
      const errors = validator.validateSync(new DefendantDetails(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DEFENDANT_TYPE_REQUIRED)
    })

    it('should accept defendant details for defendant type when individual details are valid', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.INDIVIDUAL, 'full name', undefined, undefined))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details for defendant type when individual details are undefined', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.INDIVIDUAL, undefined, undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should reject defendant details for defendant type when individual details are null', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.INDIVIDUAL, null, undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should reject defendant details for defendant type when individual details are empty strings', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.INDIVIDUAL, '', undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should accept defendant details for organisation type when organisation details are valid', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.ORGANISATION, undefined, 'organisation name', '12345678'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details for organisation type when organisation name is null', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.ORGANISATION, undefined, null, null))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.ORGANISATION_NAME_REQUIRED)
      })
    })

    it('should reject defendant details for organisation type when organisation name is undefined', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.ORGANISATION, undefined, undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.ORGANISATION_NAME_REQUIRED)
      })
    })

    it('should reject defendant details for organisation type when organisation name is empty string', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.ORGANISATION, undefined, '', ''))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.ORGANISATION_NAME_REQUIRED)
      })
    })

    it('should reject defendant details for organisation type when organisation name length is more than 255', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.ORGANISATION,
          undefined, randomstring.generate(256), '12345678'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept defendant details for party type when name length is 255', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.ORGANISATION,
          undefined, randomstring.generate(255), '12345678'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details for organisation type when companyHouseNumber length is more than 8', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.ORGANISATION,
          undefined, 'organisation', randomstring.generate(9)))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept defendant details for organisation type when companyHouseNumber length is 8', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.ORGANISATION,
          undefined, 'organisation', randomstring.generate(8)))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details for defendant type when full name length is more than 70', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.INDIVIDUAL,
          randomstring.generate(71), undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept defendant details for defendant type when fullName length is 70', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.INDIVIDUAL,
          randomstring.generate(70), undefined, undefined))

        expect(errors.length).to.equal(0)
      })
    })

    it('should accept defendant details for organisation type when sole trader details are valid', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.SOLE_TRADER, undefined, undefined, undefined, 'Sole Trader', 'businessName'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details when sole trader details are null', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.ORGANISATION, undefined, undefined, null, null))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.ORGANISATION_NAME_REQUIRED)
      })
    })

    it('should reject defendant details when sole trader details are undefined', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.SOLE_TRADER, undefined, undefined, undefined, undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should reject defendant details when sole trader details are empty strings', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.SOLE_TRADER, undefined, undefined, '', ''))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, CommonValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should accept defendant details for defendant type when businessName length is 255', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.SOLE_TRADER,
          undefined, undefined, undefined, 'soleTraderName', randomstring.generate(255)))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details for defendant type when businessName length is greater than 255', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.SOLE_TRADER,
          undefined, undefined, undefined, 'soleTraderName', randomstring.generate(256)))

        expect(errors.length).to.equal(1)
      })
    })

    it('should accept defendant details when sole trader name length is 70', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.SOLE_TRADER,
          undefined, undefined, undefined, randomstring.generate(70), 'businessName'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details when sole trader name length is greater than 70', () => {
      DefendantType.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantType.SOLE_TRADER,
          undefined, undefined, undefined, randomstring.generate(71), 'businessName'))

        expect(errors.length).to.equal(1)
      })
    })
  })

  describe('fromObject', () => {

    it('should have defendant details elements undefined when input is undefined', () => {
      const defendantDetails = DefendantDetails.fromObject(undefined)

      expect(defendantDetails.type).to.equal(undefined)
      expect(defendantDetails.fullName).to.equal(undefined)
      expect(defendantDetails.organisation).to.equal(undefined)
      expect(defendantDetails.companyHouseNumber).to.equal(undefined)
      expect(defendantDetails.businessName).to.equal(undefined)
      expect(defendantDetails.soleTraderName).to.equal(undefined)
    })

    it('should have defendant details elements undefined when input has undefined element value', () => {
      const defendantDetails = DefendantDetails.fromObject({
        type: undefined,
        fullName: undefined,
        organisation: undefined,
        companyHouseNumber: undefined,
        businessName: undefined,
        soleTraderName: undefined
      })

      expect(defendantDetails.type).to.equal(undefined)
      expect(defendantDetails.fullName).to.equal(undefined)
      expect(defendantDetails.organisation).to.equal(undefined)
      expect(defendantDetails.companyHouseNumber).to.equal(undefined)
      expect(defendantDetails.businessName).to.equal(undefined)
      expect(defendantDetails.soleTraderName).to.equal(undefined)
    })

    it('should have valid defendant details elements', () => {
      const defendantDetails = DefendantDetails.fromObject({
        type: 'INDIVIDUAL',
        fullName: 'full name',
        organisation: undefined,
        companyHouseNumber: undefined,
        businessName: undefined,
        soleTraderName: undefined
      })

      expect(defendantDetails.type).to.eql(DefendantType.INDIVIDUAL)
      expect(defendantDetails.fullName).to.equal('full name')
      expect(defendantDetails.organisation).to.equal(undefined)
      expect(defendantDetails.companyHouseNumber).to.equal(undefined)
      expect(defendantDetails.businessName).to.equal(undefined)
      expect(defendantDetails.soleTraderName).to.equal(undefined)
    })
  })
})
