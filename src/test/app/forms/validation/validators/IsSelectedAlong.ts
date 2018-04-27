import { expect } from 'chai'
import { ValidationArguments } from 'class-validator'
import { IsSelectedAlongConstraint } from 'forms/validation/validators/isSelectedAlong'

/**
 * The tests below error out when multiple selection.
 */
describe('IsSelectedAlongConstraint', () => {
  const constraint: IsSelectedAlongConstraint = new IsSelectedAlongConstraint()

  describe('validate', () => {
    describe('should return true', () => {
      it('given cannotState null', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState', 'lowerValue'],
          'targetName': '',
          'object': { 'cannotState': null, 'lowerValue': 110 },
          'property': ''
        }

        expect(constraint.validate(100, args)).to.equal(true)
      })

      it('given cannotState undefined', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState', 'lowerValue'],
          'targetName': '',
          'object': { 'cannotState': undefined, 'lowerValue': 110 },
          'property': ''
        }

        expect(constraint.validate(110, args)).to.equal(true)
      })

      it('given cannotState and lowerValue null ', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState', 'lowerValue'],
          'targetName': '',
          'object': { 'cannotState': 'cannot', 'lowerValue': null },
          'property': ''
        }

        expect(constraint.validate(null, args)).to.equal(true)
      })

    })

    describe('should return false when ', () => {

      it('given cannotState and lower value a number', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState', 'lowerValue'],
          'targetName': '',
          'object': { 'cannotState': 'cannot', 'lowerValue': 110 },
          'property': ''
        }

        expect(constraint.validate(110, args)).to.equal(false)
      })

      it('given cannotState and lower value but higherValue', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState', 'lowerValue'],
          'targetName': '',
          'object': { 'cannotState': 'cannot', 'lowerValue': 110 },
          'property': ''
        }

        expect(constraint.validate(null, args)).to.equal(false)
      })

      it('given cannotState and lower value but higherValue undefined', () => {
        const args: ValidationArguments = {
          'value': '',
          'constraints': ['cannotState', 'lowerValue'],
          'targetName': '',
          'object': { 'cannotState': 'cannot', 'lowerValue': 110 },
          'property': ''
        }

        expect(constraint.validate(undefined, args)).to.equal(false)
      })

    })
  })
})
