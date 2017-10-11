import { expect } from 'chai'

import { ClaimModelConverter } from 'app/claims/claimModelConverter'

import { claimDraft as draftTemplate } from '../../data/draft/claimDraft'
import { claimData as entityTemplate } from '../../data/entity/claimData'

import {
  claimants, defendants
} from '../../data/draft/partyDetails'

import {
  claimants as claimantsEntity, defendants as defendantsEntity
} from '../../data/entity/party'

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

  it.skip(`should convert claim issued by individual against organisation`, () => {
    const claimDraft = prepareClaimDraft(claimants, defendants)
    const claimData = prepareClaimData(claimantsEntity, defendantsEntity)

    expect(ClaimModelConverter.convert(claimDraft)).to.deep.equal(claimData)
  })

})
