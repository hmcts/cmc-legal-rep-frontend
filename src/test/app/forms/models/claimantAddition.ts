/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { PartyTypes as DefendantTypes } from 'forms/models/partyTypes'
import { ClaimantAddition, ValidationErrors } from 'app/forms/models/claimantAddition'
import { YesNo } from 'app/forms/models/yesNo'

describe('Claimant Addition', () => {
  describe('deserialize', () => {
    it('should return an instance', () => {
      let deserialized = new ClaimantAddition().deserialize({})
      expect(deserialized).to.be.instanceof(ClaimantAddition)
    })

    it('should return an instance initialised with defaults for "undefined"', () => {
      expect(new ClaimantAddition().deserialize(undefined)).to.eql(new ClaimantAddition())
    })

    it('should return an instance initialised with defaults for "null"', () => {
      expect(new ClaimantAddition().deserialize(null)).to.eql(new ClaimantAddition())
    })

    it('should return am instance from given object', () => {
      let deserialized = new ClaimantAddition().deserialize({
        isAddClaimant: YesNo.YES
      })

      expect(deserialized).to.eql(new ClaimantAddition(YesNo.YES))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject claimant addition for undefined isAddClaimant', () => {
      const errors = validator.validateSync(new ClaimantAddition(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CLAIMANT_ADDITION_REQUIRED)
    })

    it('should accept claimant addition for valid Yes isAddClaimant', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantAddition(YesNo.YES))

        expect(errors.length).to.equal(0)
      })
    })

    it('should accept claimant addition for valid No isAddClaimant', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantAddition(YesNo.NO))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject claimant addition for null isAddClaimant', () => {
      DefendantTypes.all().forEach(type => {
        const errors = validator.validateSync(new ClaimantAddition(null))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.CLAIMANT_ADDITION_REQUIRED)
      })
    })
  })

  describe('fromObject', () => {

    it('should have claimant addition element undefined when input is undefined', () => {
      const claimantDetails = ClaimantAddition.fromObject(undefined)

      expect(claimantDetails.isAddClaimant).to.equal(undefined)
    })

    it('should have claimant addition element undefined when input has undefined element value', () => {
      const claimantDetails = ClaimantAddition.fromObject({
        isAddClaimant: undefined
      })

      expect(claimantDetails.isAddClaimant).to.equal(undefined)
    })

    it('should have valid claimant addition elements', () => {
      const claimantDetails = ClaimantAddition.fromObject({
        isAddClaimant: 'YES'
      })

      expect(claimantDetails.isAddClaimant).to.eql(YesNo.YES)
    })
  })
})
