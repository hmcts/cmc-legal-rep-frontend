import * as express from 'express'
import { PartyTypes } from 'app/forms/models/partyTypes'
import Claimant from 'app/drafts/models/claimant'

export class Claimants {

  static addClaimant (res: express.Response) {
    let claimants: Claimant[] = []

    res.locals.user.legalClaimDraft.claimants.map((claimant) => claimants.push(new Claimant().deserialize(claimant)))
    claimants.push(new Claimant())

    res.locals.user.legalClaimDraft.claimants = claimants
  }

  static removeClaimant (res: express.Response, id: string) {
    let claimants: Claimant[] = []

    res.locals.user.legalClaimDraft.claimants.forEach((claimant, index) => {
      if (Number(index + 1) !== Number(id)) {
        claimants.push(new Claimant().deserialize(claimant))
      }
    })

    res.locals.user.legalClaimDraft.claimants = claimants
  }

  static getCurrentIndex (res: express.Response): number {
    return res.locals.user.legalClaimDraft.claimants.length - 1
  }

  static getCurrentClaimantName (res: express.Response): string {
    const claimants = res.locals.user.legalClaimDraft.claimants
    const claimantDetails = claimants[Claimants.getCurrentIndex(res)].claimantDetails
    const isIndividual = claimantDetails.type.value === PartyTypes.INDIVIDUAL.value
    const title = claimantDetails.title != null ? `${claimantDetails.title} ` : claimantDetails.title
    return isIndividual ? `${title}${claimantDetails.fullName}` : claimantDetails.organisation
  }
}
