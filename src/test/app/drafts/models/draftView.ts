/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import DraftView from 'app/drafts/models/draftView'

function verifyDefaultValues (initialValue: any) {
  const actualDraft: DraftView = new DraftView().deserialize(initialValue)
  const expected: DraftView = new DraftView()
  expect(actualDraft.isDefendantDeleted).to.eql(expected.isDefendantDeleted)
  expect(actualDraft.isClaimantDeleted).to.eql(expected.isClaimantDeleted)
  expect(actualDraft.defendantChangeIndex).to.eql(expected.defendantChangeIndex)
  expect(actualDraft.claimantChangeIndex).to.eql(expected.claimantChangeIndex)
}

describe('DraftView', () => {
  describe('constructor', () => {
    it('should have primitive fields initialised where possible', () => {
      let draftView = new DraftView()
      expect(draftView.isDefendantDeleted).to.be.eq(false)
      expect(draftView.isClaimantDeleted).to.be.eq(false)
      expect(draftView.defendantChangeIndex).to.be.eq(undefined)
      expect(draftView.claimantChangeIndex).to.be.eq(undefined)

    })
  })

  describe('deserialize', () => {
    it("with value 'undefined' should return a DraftView instance initialised with defaults", () => {
      verifyDefaultValues(undefined)
    })

    it("with value 'null' should return a DraftView instance initialised with defaults", () => {
      verifyDefaultValues(null)
    })
  })
})
