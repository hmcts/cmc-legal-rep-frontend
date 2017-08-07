import { expect } from 'chai'
import { IsLowerThanConstraint } from 'app/forms/validation/validators/isLowerThan'
import { ValidationArguments } from 'class-validator'

/**
 * The tests below are aligned to what GOV.UK Notify is accepting and not how we would like to validate phone numbers.
 */
describe('IsLowerThanConstraint', () => {
  const constraint: IsLowerThanConstraint = new IsLowerThanConstraint()

  describe('validate', () => {
    describe('should return true', () => {
      it('given a value is lower than upper value', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['upperValue'],
          'targetName': '',
          'object': { 'upperValue': 110 },
          'property': ''
        }

        expect(constraint.validate(100, args)).to.equal(true)
      })

      it('given a value is equal to upper value', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['upperValue'],
          'targetName': '',
          'object': { 'upperValue': 110 },
          'property': ''
        }

        expect(constraint.validate(110, args)).to.equal(true)
      })
    })

    describe('should return false when ', () => {

      it('given a value is greater than upper value', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['upperValue'],
          'targetName': '',
          'object': { 'upperValue': 110 },
          'property': ''
        }

        expect(constraint.validate(120, args)).to.equal(false)
      })

      it('given a value is not a number', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['upperValue'],
          'targetName': '',
          'object': { 'upperValue': 110 },
          'property': ''
        }

        expect(constraint.validate('asdsad', args)).to.equal(false)
      })

      it('given a upper value is not a number', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['upperValue'],
          'targetName': '',
          'object': { 'upperValue': 'asdasd' },
          'property': ''
        }

        expect(constraint.validate(110, args)).to.equal(false)
      })

      it('given constraints element is not in args object property', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['upperValue'],
          'targetName': '',
          'object': { 'differentValue': 'asdasd' },
          'property': ''
        }

        expect(constraint.validate(110, args)).to.equal(false)
      })
    })
  })
})
