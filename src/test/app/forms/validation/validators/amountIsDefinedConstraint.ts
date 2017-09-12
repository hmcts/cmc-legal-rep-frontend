import { expect } from 'chai'
import { ValidationArguments } from 'class-validator'
import { AmountIsDefinedConstraint } from 'app/forms/validation/validators/amountIsDefined'

describe('AmountIsDefinedConstraint', () => {
  const constraint: AmountIsDefinedConstraint = new AmountIsDefinedConstraint()

  describe('validate', () => {
    describe('should return true', () => {
      it('given a value is null', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState'],
          'targetName': '',
          'object': { 'cannotState': 'cannot' },
          'property': ''
        }

        expect(constraint.validate(null, args)).to.equal(true)
      })

      it('given a value is undefined', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState'],
          'targetName': '',
          'object': { 'cannotState': 'cannot' },
          'property': ''
        }

        expect(constraint.validate(undefined, args)).to.equal(true)
      })

      it('given a value is NaN ', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState'],
          'targetName': '',
          'object': { 'cannotState': 'cannot' },
          'property': ''
        }

        expect(constraint.validate(NaN, args)).to.equal(true)
      })

      it('given a value is a number', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState'],
          'targetName': '',
          'object': { 'cannotState': 'cannot' },
          'property': ''
        }

        expect(constraint.validate(110, args)).to.equal(true)
      })

      it('given constraints element is not in args object property but value is number', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState'],
          'targetName': '',
          'object': { 'someProperty': null },
          'property': ''
        }

        expect(constraint.validate(110, args)).to.equal(true)
      })

      it('given a value is not a number', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState'],
          'targetName': '',
          'object': { 'cannotState': 'cannot' },
          'property': ''
        }

        expect(constraint.validate('asdsad', args)).to.equal(true)
      })
    })

    describe('should return false when ', () => {

      it('given constraint is empty', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState'],
          'targetName': '',
          'object': { 'cannotState': '' },
          'property': ''
        }

        expect(constraint.validate(null, args)).to.equal(false)
      })

      it('given constraint is null', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState'],
          'targetName': '',
          'object': { 'cannotState': null },
          'property': ''
        }

        expect(constraint.validate(null, args)).to.equal(false)
      })

      it('given constraint is empty and value undefined', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState'],
          'targetName': '',
          'object': { 'cannotState': '' },
          'property': ''
        }

        expect(constraint.validate(undefined, args)).to.equal(false)
      })

      it('given constraint is null and value undefined', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState'],
          'targetName': '',
          'object': { 'cannotState': null },
          'property': ''
        }

        expect(constraint.validate(undefined, args)).to.equal(false)
      })
    })
  })
})
