///<reference path="../../../../main/app/forms/models/generalDamages.ts"/>
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { YesNo } from 'app/forms/models/yesNo'
import { GeneralDamages } from 'app/forms/models/generalDamages'
import { DefendantRepresented, ValidationErrors } from 'app/forms/models/defendantRepresented'
import { OrganisationName } from 'app/forms/models/organisationName'

describe('Defendant Represented', () => {
  describe('deserialize', () => {
    it('should return an instance', () => {
      let deserialized = new DefendantRepresented().deserialize({})
      expect(deserialized).to.be.instanceof(DefendantRepresented)
    })

    it('should return an instance initialised with defaults for "undefined"', () => {
      expect(new DefendantRepresented().deserialize(undefined)).to.eql(new DefendantRepresented())
    })

    it('should return an instance initialised with defaults for "null"', () => {
      expect(new DefendantRepresented().deserialize(null)).to.eql(new DefendantRepresented())
    })

    it('should return an instance from given object', () => {
      const organisationName = 'organisationName'
      let deserialized = new DefendantRepresented().deserialize({
        isDefendantRepresented: YesNo.YES,
        organisationName: organisationName
      })
      expect(deserialized).to.deep.eq(new DefendantRepresented(YesNo.YES, 'organisationName'))
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject defendant represented with undefined type', () => {
      const errors = validator.validateSync(new DefendantRepresented(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DEFENDANT_IS_REPRESENTED_REQUIRED)
    })

    it('should accept defendant represented with recognised type', () => {
      YesNo.all().forEach(type => {
        const errors = validator.validateSync(new DefendantRepresented(type, 'organisationName'))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject defendant represented with undefined organisation name', () => {
      const errors = validator.validateSync(new DefendantRepresented(YesNo.YES, undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.COMPANY_NAME_REQUIRED)
    })

    it('should accept defendant represented with valid organisation name', () => {
      GeneralDamages.all().forEach(type => {
        const errors = validator.validateSync(new DefendantRepresented(YesNo.YES, 'organisationName'))

        expect(errors.length).to.equal(0)
      })
    })
  })

  describe('fromObject', () => {

    it('should have defendant represented elements undefined when input is undefined', () => {
      const defendantRepresented = DefendantRepresented.fromObject(undefined)

      expect(defendantRepresented.isDefendantRepresented).to.equal(undefined)
      expect(defendantRepresented.organisationName).to.equal(undefined)
    })

    it('should have defendant represented elements undefined when input has invalid element value', () => {
      const defendantRepresented = DefendantRepresented.fromObject({
        isDefendantRepresented: undefined,
        organisationName: undefined
      })

      expect(defendantRepresented.isDefendantRepresented).to.equal(undefined)
      expect(defendantRepresented.organisationName).to.equal(undefined)
    })

    it('should have valid defendant respresented', () => {
      const organisationName = new OrganisationName('organisationName')
      const defendantRepresented = DefendantRepresented.fromObject({
        isDefendantRepresented: 'YES',
        organisationName: organisationName
      })

      expect(defendantRepresented.isDefendantRepresented).to.equal(YesNo.YES)
      expect(defendantRepresented.organisationName).to.eql(organisationName)
    })
  })
})
