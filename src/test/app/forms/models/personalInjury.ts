///<reference path="../../../../main/app/forms/models/generalDamages.ts"/>
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { PersonalInjury, ValidationErrors } from 'app/forms/models/personalInjury'
import { YesNo } from 'app/forms/models/yesNo'
import { GeneralDamages } from 'app/forms/models/generalDamages'

describe('Personal Injury', () => {
  describe('deserialize', () => {
    it('should return a PersonalInjury instance', () => {
      let deserialized = new PersonalInjury().deserialize({})
      expect(deserialized).to.be.instanceof(PersonalInjury)
    })

    it('should return a PersonalInjury instance with fields set to default values when given "undefined"', () => {
      let deserialized = new PersonalInjury().deserialize(undefined)
      expect(deserialized.personalInjury).to.be.undefined
      expect(deserialized.generalDamages).to.be.undefined
    })

    it('should return a PersonalInjury instance with fields set to default values when given "null"', () => {
      let deserialized = new PersonalInjury().deserialize(null)
      expect(deserialized.personalInjury).to.be.undefined
      expect(deserialized.generalDamages).to.be.undefined
    })

    it('should return a PersonalInjury instance with fields set to undefined when given an empty object', () => {
      let deserialized = new PersonalInjury().deserialize({})
      expect(deserialized.personalInjury).to.be.undefined
      expect(deserialized.generalDamages).to.be.undefined
    })

    it('should return a PersonalInjury instance with fields set when given an object with value', () => {
      let deserialized = new PersonalInjury().deserialize({
        personalInjury: YesNo.YES,
        generalDamages: GeneralDamages.MORE
      })
      expect(deserialized.personalInjury).to.be.eq(YesNo.YES)
      expect(deserialized.generalDamages).to.be.eq(GeneralDamages.MORE)
    })
  })
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject personal injury with undefined type', () => {
      const errors = validator.validateSync(new PersonalInjury(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.PERSONAL_INJURY_REQUIRED)
    })

    it('should accept personal injury with recognised type', () => {
      YesNo.all().forEach(type => {
        const errors = validator.validateSync(new PersonalInjury(type, GeneralDamages.MORE))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject personal injury without general damages', () => {
      const errors = validator.validateSync(new PersonalInjury(YesNo.YES, undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.GENERAL_DAMAGES_REQUIRED)
    })

    it('should accept personal injury with recognised general damages', () => {
      GeneralDamages.all().forEach(type => {
        const errors = validator.validateSync(new PersonalInjury(YesNo.YES, type))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject', () => {

    it('should have personal injury elements undefined when input is undefined', () => {
      const personalInjury = PersonalInjury.fromObject(undefined)

      expect(personalInjury.generalDamages).to.equal(undefined)
      expect(personalInjury.personalInjury).to.equal(undefined)
    })

    it('should have personal injury elements undefined when input has invalid element value', () => {
      const personalInjury = PersonalInjury.fromObject({ personalInjury: {}, generalDamages: {} })

      expect(personalInjury.generalDamages).to.equal(undefined)
      expect(personalInjury.personalInjury).to.equal(undefined)
    })

    it('should have valid personal injury elements', () => {
      const personalInjury = PersonalInjury.fromObject({
        personalInjury: YesNo.YES,
        generalDamages: GeneralDamages.MORE
      })

      expect(personalInjury.generalDamages).to.equal(GeneralDamages.MORE)
      expect(personalInjury.personalInjury).to.equal(YesNo.YES)
    })
  })
})
