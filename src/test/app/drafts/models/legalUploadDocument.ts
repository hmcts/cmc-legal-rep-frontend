/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import DraftUploadDocument from 'drafts/models/draftUploadDocument'

function verifyDefaultValues (initialValue: any) {
  const actualDraft: DraftUploadDocument = new DraftUploadDocument().deserialize(initialValue)
  const expected: DraftUploadDocument = new DraftUploadDocument()

  expect(actualDraft.fileToUpload).to.eql(expected.fileToUpload)
}

describe('DraftUploadDocument', () => {
  describe('constructor', () => {
    it('should have instance fields initialised where possible', () => {
      let draftClaim = new DraftUploadDocument()
      expect(draftClaim.fileToUpload).to.eq(undefined)
    })
  })

  describe('deserialize', () => {
    it('with value \'undefined\' should return a DraftUploadDocument instance initialised with defaults', () => {
      verifyDefaultValues(undefined)
    })

    it('with value \'null\' should return a DraftUploadDocument instance initialised with defaults', () => {
      verifyDefaultValues(null)
    })
  })
})
