import { expect } from 'chai'

import { ClaimModelConverter } from 'app/claims/claimModelConverter'

import { claimDraft as draftTemplate } from '../../data/draft/claimDraft'
import { claimData as entityTemplate } from '../../data/entity/claimData'

import { claimants, defendants } from '../../data/draft/partyDetails'

import { claimants as claimantsEntity, defendants as defendantsEntity } from '../../data/entity/party'

import DraftLegalClaim from 'drafts/models/draftLegalClaim'
import ClaimData from 'claims/models/claimData'

function prepareClaimDraft (claimants: object, defendants: object): DraftLegalClaim {
  return new DraftLegalClaim().deserialize({
    ...draftTemplate,
    claimants: claimants,
    defendants: defendants
  })
}

function prepareClaimData (claimants: object, defendants: object): ClaimData {
  return new ClaimData().deserialize({
    ...entityTemplate,
    claimants: claimantsEntity,
    defendants: defendantsEntity
  })
}

describe('ClaimModelConverter', () => {

  it(`should convert claim issued by individual against organisation`, () => {
    const claimDraft = prepareClaimDraft(claimants, defendants)
    const claimData: ClaimData = prepareClaimData(claimantsEntity, defendantsEntity)
    const target: any = ClaimModelConverter.convert(claimDraft)

    expect(target.externalId).to.equal(claimData.externalId)
    expect(target.feeAmountInPennies).to.equal(claimData.feeAmountInPennies)
    expect(target.feeCode).to.equal(claimData.feeCode)
    expect(target.feeAccountNumber).to.equal(claimData.feeAccountNumber)
    expect(target.externalReferenceNumber).to.equal(claimData.externalReferenceNumber)
    expect(target.preferredCourt).to.equal(claimData.preferredCourt)
    expect(target.reason).to.equal(claimData.reason)
    expect(target.statementOfTruth.signerName).to.equal(claimData.statementOfTruth.signerName)
    expect(target.statementOfTruth.signerRole).to.equal(claimData.statementOfTruth.signerRole)
    expect(target.amount.type).to.equal(claimData.amount.type)
    expect(target.amount.cannotState).to.equal(claimData.amount.cannotState)
    expect(target.amount.lowerValue).to.equal(claimData.amount.lowerValue)
    expect(target.amount.higherValue).to.equal(claimData.amount.higherValue)
    expect(target.claimants.length).to.equal(claimData.claimants.length)
    expect(target.defendants.length).to.equal(claimData.defendants.length)
  })

})
