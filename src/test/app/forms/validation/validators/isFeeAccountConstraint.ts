import { expect } from 'chai'
import { IsFeeAccountConstraint } from 'app/forms/validation/validators/isFeeAccount'

describe('IsFeeAccountConstraint', () => {
  const constraint: IsFeeAccountConstraint = new IsFeeAccountConstraint()

  describe('validate', () => {
    describe('should return true when', () => {
      it('given an valid reference ', () => {
        expect(constraint.validate('PBA1234567')).to.equal(true)
      })

      it('given an valid reference in lower case', () => {
        expect(constraint.validate('pba1234567')).to.equal(true)
      })

      it('given an valid reference with leading spaces', () => {
        expect(constraint.validate('   PBA1234567')).to.equal(true)
      })

      it('given an valid reference with trailing spaces', () => {
        expect(constraint.validate('PBA1234567  ')).to.equal(true)
      })

      it('given null', () => {
        expect(constraint.validate(null)).to.equal(true)
      })

      it('given undefined', () => {
        expect(constraint.validate(undefined)).to.equal(true)
      })
    })

    describe('should return false when ', () => {

      it('given an empty string', () => {
        expect(constraint.validate('')).to.equal(false)
      })

      it('given an invalid reference prefix', () => {
        expect(constraint.validate('aaa1234567')).to.equal(false)
      })

      it('given an invalid digit suffix', () => {
        expect(constraint.validate('PBA123456d')).to.equal(false)
      })

      it('given an invalid length for digit suffix', () => {
        expect(constraint.validate('PBA123456789')).to.equal(false)
      })

      it('given a number', () => {
        expect(constraint.validate(1231234567)).to.equal(false)
      })

      it('given a character string', () => {
        expect(constraint.validate('PBAabcdefg')).to.equal(false)
      })

      it('given an object', () => {
        expect(constraint.validate({})).to.equal(false)
      })

    })
  })
})
