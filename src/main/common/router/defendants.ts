import * as express from 'express'
import Defendant from 'app/drafts/models/defendant'
import { PartyTypes } from 'app/forms/models/partyTypes'
import { Paths as ClaimPaths } from 'claim/paths'

export class Defendants {

  static addDefendant (res: express.Response) {
    let defendants: Defendant[] = []

    res.locals.user.legalClaimDraft.document.defendants.map((defendant) => defendants.push(new Defendant().deserialize(defendant)))
    defendants.push(new Defendant())

    res.locals.user.legalClaimDraft.document.defendants = defendants
  }

  static removeDefendant (res: express.Response, id: string) {
    let defendants: Defendant[] = []

    res.locals.user.legalClaimDraft.document.defendants.forEach((defendant, index) => {
      if (Number(index + 1) !== Number(id)) {
        defendants.push(new Defendant().deserialize(defendant))
      }
    })

    res.locals.user.legalClaimDraft.document.defendants = defendants
  }

  static getIndex (res: express.Response): number {
    const changeIndex = res.locals.user.viewDraft.document.defendantChangeIndex
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
    return res.locals.user.legalClaimDraft.document.defendants.length - 1
  }

  static getCurrentDefendantName (res: express.Response): string {
    const defendants = res.locals.user.legalClaimDraft.document.defendants
    const defendantDetails = defendants[Defendants.getIndex(res)].defendantDetails
    const isIndividual = defendantDetails.type.value === PartyTypes.INDIVIDUAL.value
    return isIndividual ? defendantDetails.fullName : defendantDetails.organisation
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
