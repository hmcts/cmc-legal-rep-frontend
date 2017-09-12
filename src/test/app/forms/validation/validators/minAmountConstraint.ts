import { expect } from 'chai'
import { ValidationArguments } from 'class-validator'
import { MinAmountConstraint } from 'app/forms/validation/validators/minAmount'
import { Amount } from 'app/forms/models/amount'

describe('MinAmountConstraint', () => {
  const constraint: MinAmountConstraint = new MinAmountConstraint()

  describe('validate', () => {
    describe('should return true', () => {
      it('given a value is null', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, 'cannot')

        expect(constraint.validate(null, args)).to.equal(true)
      })

      it('given a value is undefined', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, 'cannot')

        expect(constraint.validate(undefined, args)).to.equal(true)
      })

      it('given a value is a valid number greater than min', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, 'cannot')

        expect(constraint.validate(110, args)).to.equal(true)
      })

      it('given a value is a valid number equal to min', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, 'cannot')

        expect(constraint.validate(Amount.MIN_ALLOWED, args)).to.equal(true)
      })
    })

    describe('should return false when ', () => {

      it('given constraint is empty', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, '')

        expect(constraint.validate(null, args)).to.equal(false)
      })

      it('given constraint is null', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, null)

        expect(constraint.validate(null, args)).to.equal(false)
      })

      it('given constraint is empty and value undefined', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, '')

        expect(constraint.validate(undefined, args)).to.equal(false)
      })

      it('given constraint is null and value undefined', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, null)

        expect(constraint.validate(undefined, args)).to.equal(false)
      })

      it('given constraint is null and value not a number', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, null)

        expect(constraint.validate('some number', args)).to.equal(false)
      })

      it('given a value is NaN ', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, 'cannot')

        expect(constraint.validate(NaN, args)).to.equal(false)
      })

      it('given a value is not a number', () => {
        const args: ValidationArguments = validationArgs(Amount.MIN_ALLOWED, 'cannot')

        expect(constraint.validate('asdsad', args)).to.equal(false)
      })
    })
  })
})

function validationArgs (input: number, cannotState: String): ValidationArguments {
  return {
    value: undefined,
    targetName: undefined,
    object: { 'cannotState': cannotState },
    property: undefined,
    constraints: [input, 'cannotState']
  }
}
