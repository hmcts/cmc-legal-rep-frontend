import { expect } from 'chai'
import { ValidationArguments } from 'class-validator'
import { MaxAmountRangeConstraint } from 'app/forms/validation/validators/maxAmountRange'
import { Amount } from 'app/forms/models/amount'

describe('MaxAmountConstraint', () => {
  const constraint: MaxAmountRangeConstraint = new MaxAmountRangeConstraint()

  describe('validate', () => {
    describe('should return true', () => {
      it('given a value is null', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, 'cannot')

        expect(constraint.validate(null, args)).to.equal(true)
      })

      it('given a value is undefined', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, 'cannot')

        expect(constraint.validate(undefined, args)).to.equal(true)
      })

      it('given a value is a valid number less than max', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, 'cannot')

        expect(constraint.validate(Amount.MAX_ALLOWED - 1, args)).to.equal(true)
      })

      it('given a value is a valid number equal to max', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, 'cannot')

        expect(constraint.validate(Amount.MAX_ALLOWED, args)).to.equal(true)
      })

      it('given constraint is empty', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, '')

        expect(constraint.validate(null, args)).to.equal(true)
      })

      it('given constraint is null', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, null)

        expect(constraint.validate(null, args)).to.equal(true)
      })
    })

    describe('should return false when ', () => {

      it('given constraint is empty and value undefined', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, '')

        expect(constraint.validate(undefined, args)).to.equal(false)
      })

      it('given constraint is null and value undefined', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, null)

        expect(constraint.validate(undefined, args)).to.equal(false)
      })

      it('given constraint is null and value not a number', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, null)

        expect(constraint.validate('some number', args)).to.equal(false)
      })

      it('given a value is NaN ', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, 'cannot')

        expect(constraint.validate(NaN, args)).to.equal(false)
      })

      it('given a value is not a number', () => {
        const args: ValidationArguments = validationArgs(Amount.MAX_ALLOWED, 'cannot')

        expect(constraint.validate('asdsad', args)).to.equal(false)
      })
    })
  })
})

function validationArgs (input: number, cannotState: string): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: { 'cannotState': cannotState },
    property: undefined,
    constraints: [input, 'cannotState']
  }
}
