import * as express from 'express'
import Defendant from 'app/drafts/models/defendant'
import { PartyType } from 'app/common/partyType'
import { Paths as ClaimPaths } from 'claim/paths'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'

export class Defendants {

  static addDefendant (res: express.Response) {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    let defendants: Defendant[] = []

    draft.document.defendants.map((defendant) => defendants.push(new Defendant().deserialize(defendant)))
    defendants.push(new Defendant())

    draft.document.defendants = defendants
  }

  static removeDefendant (res: express.Response, id: string) {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    let defendants: Defendant[] = []

    draft.document.defendants.forEach((defendant, index) => {
      if (Number(index + 1) !== Number(id)) {
        defendants.push(new Defendant().deserialize(defendant))
      }
    })

    draft.document.defendants = defendants
  }

  static getIndex (res: express.Response): number {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    const changeIndex = draft.document.defendantChangeIndex
    return changeIndex !== undefined ? changeIndex : Defendants.getCurrentIndex(res)
  }

  static getChangeIndex (req: express.Request, res: express.Response): number {
    const index = req.query.index ? (req.query.index - 1) : -1
    if (index < 0 || index > Defendants.getCurrentIndex(res)) {
      throw Error('Invalid index for defendant')
    }
    return index
  }

  static getNextPage (req: express.Request): string {
    let pagePath: string
    switch (req.query.page) {
      case 'address':
        pagePath = ClaimPaths.defendantAddressPage.uri
        break
      case 'represented':
        pagePath = ClaimPaths.defendantRepresentedPage.uri
        break
      case 'reps-address':
        pagePath = ClaimPaths.defendantRepAddressPage.uri
        break
      case 'service-address':
        pagePath = ClaimPaths.defendantServiceAddressPage.uri
        break
      default:
        pagePath = ClaimPaths.defendantTypePage.uri
    }
    return pagePath
  }

  static getCurrentIndex (res: express.Response): number {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    return draft.document.defendants.length - 1
  }

  static getCurrentDefendantName (res: express.Response): string {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    const defendants = draft.document.defendants
    const defendantDetails = defendants[Defendants.getIndex(res)].defendantDetails
    let defendantName
    switch (defendantDetails.type.value) {
      case PartyType.INDIVIDUAL.value:
        defendantName = defendantDetails.fullName
        break
      case PartyType.ORGANISATION.value:
        defendantName = defendantDetails.organisation
        break
      case PartyType.SOLE_TRADER.value:
        if (defendantDetails.businessName) {
          defendantName = defendantDetails.soleTraderName + ' trading as ' + defendantDetails.businessName
        } else {
          defendantName = defendantDetails.soleTraderName
        }
        break
    }
    return defendantName
  }

  static getPartyStrip (res: express.Response): string {
    const index = Defendants.getIndex(res)
    return index >= 1 ? `Defendant ${index + 1}` : `Defendant`
  }

  static getPartyStripeTitleForRepresentative (res: express.Response): string {
    const index = Defendants.getIndex(res)
    return index >= 1 ? `Defendant ${index + 1}'s legal representative` : `Defendant's legal representative`
  }

}
