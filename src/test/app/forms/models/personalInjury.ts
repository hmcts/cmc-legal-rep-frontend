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
    it('should return an instance', () => {
      let deserialized = new PersonalInjury().deserialize({})
      expect(deserialized).to.be.instanceof(PersonalInjury)
    })

    it('should return an instance initialised with defaults for "undefined"', () => {
      expect(new PersonalInjury().deserialize(undefined)).to.eql(new PersonalInjury())
    })

    it('should return an instance initialised with defaults for "null"', () => {
      expect(new PersonalInjury().deserialize(null)).to.eql(new PersonalInjury())
    })

    it('should return am instance from given object', () => {
      let deserialized = new PersonalInjury().deserialize({
        personalInjury: YesNo.YES,
        generalDamages: GeneralDamages.MORE
      })
      expect(deserialized).to.eql(new PersonalInjury(YesNo.YES, GeneralDamages.MORE))
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
