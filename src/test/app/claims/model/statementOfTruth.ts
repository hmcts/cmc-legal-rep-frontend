/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { StatementOfTruth } from 'claims/models/statementOfTruth'

describe('StatementOfTruth', () => {

  describe('constructor', () => {
    it('should set primitive type fields to undefined', () => {
      let statementOfTruth = new StatementOfTruth()
      expect(statementOfTruth.signerName).to.be.undefined
      expect(statementOfTruth.signerRole).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a StatementOfTruth instance initialised with defaults for undefined', () => {
      expect(new StatementOfTruth().deserialize(undefined)).to.eql(new StatementOfTruth())
    })

    it('should return a StatementOfTruth instance initialised with defaults for null', () => {
      expect(new StatementOfTruth().deserialize(null)).to.eql(new StatementOfTruth())
    })

    it('should return a StatementOfTruth instance with set fields from given object', () => {
      const result = new StatementOfTruth().deserialize({
        signerName: 'Tom',
        signerRole: 'Solicitor'
      })
      expect(result.signerName).to.be.equals('Tom')
      expect(result.signerRole).to.be.equals('Solicitor')
    })
  })

})
