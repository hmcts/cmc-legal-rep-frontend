/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'

import { HousingDisrepair, ValidationErrors } from 'forms/models/housingDisrepair'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { GeneralDamages } from 'forms/models/generalDamages'
import { OtherDamages } from 'forms/models/otherDamages'
import { YesNo } from 'forms/models/yesNo'

describe('Housing Disrepair', () => {
  describe('deserialize', () => {
    it('should return an instance', () => {
      let deserialized = new HousingDisrepair().deserialize({})
      expect(deserialized).to.be.instanceof(HousingDisrepair)
    })

    it('should return an instance initialised with defaults for "undefined"', () => {
      expect(new HousingDisrepair().deserialize(undefined)).to.eql(new HousingDisrepair())
    })

    it('should return an instance initialised with defaults for "null"', () => {
      expect(new HousingDisrepair().deserialize(null)).to.eql(new HousingDisrepair())
    })

    it('should return am instance from given object', () => {
      let deserialized = new HousingDisrepair().deserialize({
        housingDisrepair: YesNo.YES,
        generalDamages: GeneralDamages.MORE,
        otherDamages: OtherDamages.NONE
      })

      expect(deserialized).to.eql(new HousingDisrepair(YesNo.YES, GeneralDamages.MORE, OtherDamages.NONE))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject housing disrepair with undefined type', () => {
      const errors = validator.validateSync(new HousingDisrepair(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.HOUSING_DISREPAIR_REQUIRED)
    })

    it('should accept housing disrepair with recognised type', () => {
      YesNo.all().forEach(type => {
        const errors = validator.validateSync(new HousingDisrepair(type, GeneralDamages.MORE, OtherDamages.NONE))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject housing disrepair without general or other damages', () => {
      const errors = validator.validateSync(new HousingDisrepair(YesNo.YES, undefined, undefined))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, CommonValidationErrors.GENERAL_DAMAGES_REQUIRED)
      expectValidationError(errors, ValidationErrors.OTHER_DAMAGES_REQUIRED)
    })

    it('should reject housing disrepair without general damages', () => {
      const errors = validator.validateSync(new HousingDisrepair(YesNo.YES, undefined, OtherDamages.NONE))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, CommonValidationErrors.GENERAL_DAMAGES_REQUIRED)
    })

    it('should reject housing disrepair without other damages', () => {
      const errors = validator.validateSync(new HousingDisrepair(YesNo.YES, GeneralDamages.LESS, undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OTHER_DAMAGES_REQUIRED)
    })

    it('should accept housing disrepair with recognised general damages', () => {
      GeneralDamages.all().forEach(type => {
        const errors = validator.validateSync(new HousingDisrepair(YesNo.YES, type, OtherDamages.NONE))

        expect(errors.length).to.equal(0)
      })
    })

    it('should accept housing disrepair with recognised other damages', () => {
      OtherDamages.all().forEach(type => {
        const errors = validator.validateSync(new HousingDisrepair(YesNo.YES, GeneralDamages.LESS, type))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject', () => {

    it('should have housing disrepair elements undefined when input is undefined', () => {
      const housingDisrepair = HousingDisrepair.fromObject(undefined)

      expect(housingDisrepair.generalDamages).to.equal(undefined)
      expect(housingDisrepair.housingDisrepair).to.equal(undefined)
      expect(housingDisrepair.otherDamages).to.equal(undefined)
    })

    it('should have housing disrepair elements undefined when input has invalid element value', () => {
      const housingDisrepair = HousingDisrepair.fromObject({
        housingDisrepair: {},
        generalDamages: {},
        otherDamages: {}
      })

      expect(housingDisrepair.generalDamages).to.equal(undefined)
      expect(housingDisrepair.housingDisrepair).to.equal(undefined)
      expect(housingDisrepair.otherDamages).to.equal(undefined)
    })

    it('should have valid housing disrepair elements', () => {
      const housingDisrepair = HousingDisrepair.fromObject({
        housingDisrepair: YesNo.YES.value,
        generalDamages: GeneralDamages.MORE,
        otherDamages: OtherDamages.NONE
      })

      expect(housingDisrepair.generalDamages).to.equal(GeneralDamages.MORE)
      expect(housingDisrepair.housingDisrepair).to.equal(YesNo.YES)
      expect(housingDisrepair.otherDamages).to.equal(OtherDamages.NONE)
    })
  })
})
