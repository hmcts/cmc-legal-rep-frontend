/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import Claimant from 'drafts/models/claimant'
import DraftLegalClaim from 'app/drafts/models/draftLegalClaim'
import { StatementOfTruth } from 'app/forms/models/statementOfTruth'
import Defendant from 'app/drafts/models/defendant'
import Representative from 'app/drafts/models/representative'
import PreferredCourt from 'app/forms/models/preferredCourt'
import { HousingDisrepair } from 'app/forms/models/housingDisrepair'
import { PersonalInjury } from 'app/forms/models/personalInjury'
import { YourReference } from 'app/forms/models/yourReference'
import Summary from 'app/forms/models/summary'
import { FeeAccount } from 'forms/models/FeeAccount'

function verifyDefaultValues (initialValue: any) {
  const actualDraft: DraftLegalClaim = new DraftLegalClaim().deserialize(initialValue)
  const expected: DraftLegalClaim = new DraftLegalClaim()

  expect(actualDraft.claimant).to.eql(expected.claimant)
  expect(actualDraft.summary).to.eql(expected.summary)
  expect(actualDraft.yourReference).to.eql(expected.yourReference)
  expect(actualDraft.personalInjury).to.eql(expected.personalInjury)
  expect(actualDraft.housingDisrepair).to.eql(expected.housingDisrepair)
  expect(actualDraft.preferredCourt).to.eql(expected.preferredCourt)
  expect(actualDraft.representative).to.eql(expected.representative)
  expect(actualDraft.defendant).to.eql(expected.defendant)
  expect(actualDraft.statementOfTruth).to.eql(expected.statementOfTruth)
  expect(actualDraft.feeAccount).to.eql(expected.feeAccount)
}

describe('DraftLegalClaim', () => {
  describe('constructor', () => {
    it('should have instance fields initialised where possible', () => {
      let draftClaim = new DraftLegalClaim()
      expect(draftClaim.claimant).to.be.instanceof(Claimant)
      expect(draftClaim.summary).to.be.instanceof(Summary)
      expect(draftClaim.yourReference).to.be.instanceof(YourReference)
      expect(draftClaim.personalInjury).to.be.instanceof(PersonalInjury)
      expect(draftClaim.housingDisrepair).to.be.instanceof(HousingDisrepair)
      expect(draftClaim.preferredCourt).to.be.instanceof(PreferredCourt)
      expect(draftClaim.representative).to.be.instanceof(Representative)
      expect(draftClaim.defendant).to.be.instanceof(Defendant)
      expect(draftClaim.statementOfTruth).to.be.instanceof(StatementOfTruth)
      expect(draftClaim.feeAccount).to.be.instanceof(FeeAccount)
    })
  })

  describe('deserialize', () => {
    it('with value \'undefined\' should return a DraftClaim instance initialised with defaults', () => {
      verifyDefaultValues(undefined)
    })

    it('with value \'null\' should return a DraftClaim instance initialised with defaults', () => {
      verifyDefaultValues(null)
    })
  })
})
