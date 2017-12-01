/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'
import { WhatDocuments } from 'forms/models/whatDocuments'

function verifyDefaultValues (initialValue: any) {
  const actualDraft: DraftCertificateOfService = new DraftCertificateOfService().deserialize(initialValue)
  const expected: DraftCertificateOfService = new DraftCertificateOfService()

  expect(actualDraft.whatDocuments).to.eql(expected.whatDocuments)
}

describe('DraftCertificateOfService', () => {
  describe('constructor', () => {
    it('should have instance fields initialised where possible', () => {
      let draftClaim = new DraftCertificateOfService()
      expect(draftClaim.whatDocuments).to.be.instanceof(WhatDocuments)
    })
  })

  describe('deserialize', () => {
    it('with value \'undefined\' should return a DraftCertificateOfService instance initialised with defaults', () => {
      verifyDefaultValues(undefined)
    })

    it('with value \'null\' should return a DraftCertificateOfService instance initialised with defaults', () => {
      verifyDefaultValues(null)
    })
  })
})
