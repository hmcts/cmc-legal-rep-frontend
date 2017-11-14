import * as express from 'express'
import { PartyTypes } from 'app/forms/models/partyTypes'
import Claimant from 'app/drafts/models/claimant'
import { Paths as ClaimPaths } from 'claim/paths'

export class Claimants {

  static addClaimant (res: express.Response) {
    let claimants: Claimant[] = []

    res.locals.user.legalClaimDraft.document.claimants.map((claimant) => claimants.push(new Claimant().deserialize(claimant)))
    claimants.push(new Claimant())

    res.locals.user.legalClaimDraft.document.claimants = claimants
  }

  static removeClaimant (res: express.Response, id: string) {
    let claimants: Claimant[] = []

    res.locals.user.legalClaimDraft.document.claimants.forEach((claimant, index) => {
      if (Number(index + 1) !== Number(id)) {
        claimants.push(new Claimant().deserialize(claimant))
      }
    })

    res.locals.user.legalClaimDraft.document.claimants = claimants
  }

  static getCurrentIndex (res: express.Response): number {
    return res.locals.user.legalClaimDraft.document.claimants.length - 1
  }

  static getCurrentClaimantName (res: express.Response): string {
    const claimants = res.locals.user.legalClaimDraft.document.claimants
    const claimantDetails = claimants[Claimants.getIndex(res)].claimantName
    const isIndividual = claimantDetails.type.value === PartyTypes.INDIVIDUAL.value
    const title = claimantDetails.title != null ? `${claimantDetails.title} ` : claimantDetails.title
    return isIndividual ? `${title}${claimantDetails.value}` : claimantDetails.organisation
  }

  static getIndex (res: express.Response): number {
    const changeIndex = res.locals.user.viewDraft.document.claimantChangeIndex
    return changeIndex !== undefined ? changeIndex : Claimants.getCurrentIndex(res)
  }

  static getChangeIndex (req: express.Request, res: express.Response): number {
    const index = req.query.index !== undefined ? (req.query.index - 1) : -1
    if (index < 0 || index > Claimants.getCurrentIndex(res)) {
      throw Error('Invalid index for claimant')
    }
    return index
  }

  static getNextPage (req: express.Request): string {
    let pagePath: string
    switch (req.query.page) {
      case 'address':
        pagePath = ClaimPaths.claimantAddressPage.uri
        break
      default:
        pagePath = ClaimPaths.claimantTypePage.uri
    }
    return pagePath
  }

  static getPartyStrip (res: express.Response): string {
    const index = Claimants.getIndex(res)
    return index >= 1 ? `Claimant ${index + 1}` : `Claimant`
  }

}
