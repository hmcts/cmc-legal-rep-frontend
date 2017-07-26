/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { DefendantTypes } from 'forms/models/defendantTypes'
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
        type: DefendantTypes.INDIVIDUAL,
        title: 'title',
        fullName: 'full name',
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(deserialized).to.eql(new DefendantDetails(DefendantTypes.INDIVIDUAL, 'title', 'full name', undefined, undefined))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject defendant details for undefined type', () => {
      const errors = validator.validateSync(new DefendantDetails(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DEFENDANT_TYPE_REQUIRED)
    })

    it('should accept defendant details for individual type when individual details are valid', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.INDIVIDUAL, 'title', 'full name', undefined, undefined))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details for individual type when individual details are undefined', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.INDIVIDUAL, undefined, undefined, undefined, undefined))

        expect(errors.length).to.equal(2)
        expectValidationError(errors, ValidationErrors.FULLNAME_REQUIRED)
        expectValidationError(errors, ValidationErrors.TITLE_REQUIRED)
      })
    })

    it('should reject defendant details for individual type when individual details are null', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.INDIVIDUAL, null, null, undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should reject defendant details for individual type when individual details are null', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.INDIVIDUAL, '', '', undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.FULLNAME_REQUIRED)
      })
    })

    it('should accept defendant details for organisation type when organisation details are valid', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.ORGANISATION, undefined, undefined, 'organisation name', '12345678'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details for organisation type when organisation name is null', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.ORGANISATION, undefined, undefined, null, '12345678'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.ORGANISATION_NAME_REQUIRED)
      })
    })

    it('should reject defendant details for organisation type when organisation name is undefined', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.ORGANISATION, undefined, undefined, undefined, '12345678'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.ORGANISATION_NAME_REQUIRED)
      })
    })

    it('should reject defendant details for organisation type when organisation name length is more than 255', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.ORGANISATION,
          undefined, undefined, randomstring.generate( 256 ), '12345678'))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept defendant details for organisation type when organisation name length is 255', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.ORGANISATION,
          undefined, undefined, randomstring.generate( 255 ), '12345678'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details for organisation type when companyHouseNumber length is more than 8', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.ORGANISATION,
          undefined, undefined, 'organisation', randomstring.generate( 9 )))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept defendant details for organisation type when companyHouseNumber length is 8', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.ORGANISATION,
          undefined, undefined, 'organisation', randomstring.generate( 8 )))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant details for individual type when full name length is more than 70', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.INDIVIDUAL,
          'title', randomstring.generate( 71 ), undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should reject defendant details for individual type when title length is more than 35', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.INDIVIDUAL,
          randomstring.generate( 36 ), 'fullname', undefined, undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.CONTENT_TOO_LONG)
      })
    })

    it('should accept defendant details for individual type when fullName length is 70', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.INDIVIDUAL,
          'title', randomstring.generate( 70 ), undefined, undefined))

        expect(errors.length).to.equal(0)
      })
    })

    it('should accept defendant details for individual type when title length is 35', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantDetails(DefendantTypes.INDIVIDUAL,
          randomstring.generate( 35 ), 'fullName', undefined, undefined))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject', () => {

    it('should have defendant details elements undefined when input is undefined', () => {
      const defendantDetails = DefendantDetails.fromObject(undefined)

      expect(defendantDetails.type).to.equal(undefined)
      expect(defendantDetails.title).to.equal(undefined)
      expect(defendantDetails.fullName).to.equal(undefined)
      expect(defendantDetails.organisation).to.equal(undefined)
      expect(defendantDetails.companyHouseNumber).to.equal(undefined)
    })

    it('should have defendant details elements undefined when input has undefined element value', () => {
      const defendantDetails = DefendantDetails.fromObject({
        type: undefined,
        title: undefined,
        fullName: undefined,
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(defendantDetails.type).to.equal(undefined)
      expect(defendantDetails.title).to.equal(undefined)
      expect(defendantDetails.fullName).to.equal(undefined)
      expect(defendantDetails.organisation).to.equal(undefined)
      expect(defendantDetails.companyHouseNumber).to.equal(undefined)
    })

    it('should have valid defendant details elements', () => {
      const defendantDetails = DefendantDetails.fromObject({
        type: 'INDIVIDUAL',
        title: 'title',
        fullName: 'full name',
        organisation: undefined,
        companyHouseNumber: undefined
      })

      expect(defendantDetails.type).to.eql(DefendantTypes.INDIVIDUAL)
      expect(defendantDetails.title).to.equal('title')
      expect(defendantDetails.fullName).to.equal('full name')
      expect(defendantDetails.organisation).to.equal(undefined)
      expect(defendantDetails.companyHouseNumber).to.equal(undefined)
    })
  })
})
