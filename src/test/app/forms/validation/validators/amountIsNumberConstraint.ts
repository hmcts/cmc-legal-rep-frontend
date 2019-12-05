import { expect } from 'chai'
import { ValidationArguments } from '@hmcts/class-validator'
import { IsAmountRangeNumberConstraint } from 'forms/validation/validators/isAmountRangeNumber'
import { Amount } from 'forms/models/amount'

describe('AmountIsNumberConstraint', () => {
  const constraint: IsAmountRangeNumberConstraint = new IsAmountRangeNumberConstraint()

  describe('validate', () => {
    describe('should return true', () => {
      it('given a value is null', () => {
        const args: ValidationArguments = validationArgs(Amount.CANNOT_STATE_VALUE)

        expect(constraint.validate(null, args)).to.equal(true)
      })

      it('given a value is undefined', () => {
        const args: ValidationArguments = validationArgs(Amount.CANNOT_STATE_VALUE)

        expect(constraint.validate(undefined, args)).to.equal(true)
      })

      it('given a value is NaN ', () => {
        const args: ValidationArguments = validationArgs(Amount.CANNOT_STATE_VALUE)

        expect(constraint.validate(NaN, args)).to.equal(true)
      })

      it('given a value is a number', () => {
        const args: ValidationArguments = validationArgs(Amount.CANNOT_STATE_VALUE)

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
    })

    describe('should return false when ', () => {

      it('given constraint is empty', () => {
        const args: ValidationArguments = validationArgs('')

        expect(constraint.validate(null, args)).to.equal(false)
      })

      it('given constraint is null', () => {
        const args: ValidationArguments = validationArgs(null)

        expect(constraint.validate(null, args)).to.equal(false)
      })

      it('given constraint is empty and value undefined', () => {
        const args: ValidationArguments = validationArgs('')

        expect(constraint.validate(undefined, args)).to.equal(false)
      })

      it('given constraint is null and value undefined', () => {
        const args: ValidationArguments = validationArgs(null)

        expect(constraint.validate(undefined, args)).to.equal(false)
      })

      it('given a value is not a number', () => {
        const args: ValidationArguments = validationArgs(Amount.CANNOT_STATE_VALUE)

        expect(constraint.validate('asdsad', args)).to.equal(false)
      })

      it('given constraint is null and value not a number', () => {
        const args: ValidationArguments = validationArgs(null)
        expect(constraint.validate('some number', args)).to.equal(false)
      })
    })
  })
})

function validationArgs (cannotState: string): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: { 'cannotState': cannotState },
    property: undefined,
    constraints: ['cannotState']
  }
}
