/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { PartyType as DefendantTypes } from 'forms/../../../../main/app/common/partyType'
import { DefendantAddition, ValidationErrors } from 'app/forms/models/defendantAddition'
import { YesNo } from 'app/forms/models/yesNo'

describe('Defendant Addition', () => {
  describe('deserialize', () => {
    it('should return an instance', () => {
      let deserialized = new DefendantAddition().deserialize({})
      expect(deserialized).to.be.instanceof(DefendantAddition)
    })

    it('should return an instance initialised with defaults for "undefined"', () => {
      expect(new DefendantAddition().deserialize(undefined)).to.eql(new DefendantAddition())
    })

    it('should return an instance initialised with defaults for "null"', () => {
      expect(new DefendantAddition().deserialize(null)).to.eql(new DefendantAddition())
    })

    it('should return am instance from given object', () => {
      let deserialized = new DefendantAddition().deserialize({
        isAddDefendant: YesNo.YES
      })

      expect(deserialized).to.eql(new DefendantAddition(YesNo.YES))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject defendant addition for undefined isAddDefendant', () => {
      const errors = validator.validateSync(new DefendantAddition(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DEFENDANT_ADDITION_REQUIRED)
    })

    it('should accept defendant addition for valid Yes isAddDefendant', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantAddition(YesNo.YES))

        expect(errors.length).to.equal(0)
      })
    })

    it('should accept defendant addition for valid No isAddDefendant', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantAddition(YesNo.NO))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant addition for null isAddDefendant', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new DefendantAddition(null))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DEFENDANT_ADDITION_REQUIRED)
      })
    })
  })

  describe('fromObject', () => {

    it('should have defendant addition element undefined when input is undefined', () => {
      const defendantDetails = DefendantAddition.fromObject(undefined)

      expect(defendantDetails.isAddDefendant).to.equal(undefined)
    })

    it('should have defendant addition element undefined when input has undefined element value', () => {
      const defendantDetails = DefendantAddition.fromObject({
        isAddDefendant: undefined
      })

      expect(defendantDetails.isAddDefendant).to.equal(undefined)
    })

    it('should have valid defendant addition elements', () => {
      const defendantDetails = DefendantAddition.fromObject({
        isAddDefendant: 'YES'
      })

      expect(defendantDetails.isAddDefendant).to.eql(YesNo.YES)
    })
  })
})
