import * as express from 'express'
import Defendant from 'app/drafts/models/defendant'
import { PartyTypes } from 'app/forms/models/partyTypes'

export class Defendants {

  static addDefendant (res: express.Response) {
    let defendants: Defendant[] = []

    res.locals.user.legalClaimDraft.defendants.map((defendant) => defendants.push(new Defendant().deserialize(defendant)))
    defendants.push(new Defendant())

    res.locals.user.legalClaimDraft.defendants = defendants
  }

  static removeDefendant (res: express.Response, id: string) {
    let defendants: Defendant[] = []

    res.locals.user.legalClaimDraft.defendants.forEach((defendant, index) => {
      if (Number(index + 1) !== Number(id)) {
        defendants.push(new Defendant().deserialize(defendant))
      }
    })

    res.locals.user.legalClaimDraft.defendants = defendants
  }

  static getCurrentIndex (res: express.Response): number {
    return res.locals.user.legalClaimDraft.defendants.length - 1
  }

  static getCurrentDefendantName (res: express.Response): string {
    const defendants = res.locals.user.legalClaimDraft.defendants
    const defendantDetails = defendants[Defendants.getCurrentIndex(res)].defendantDetails
    const isIndividual = defendantDetails.type.value === PartyTypes.INDIVIDUAL.value
    const title = defendantDetails.title != null ? `${defendantDetails.title} ` : defendantDetails.title
    return isIndividual ? `${title}${defendantDetails.fullName}` : defendantDetails.organisation
  }
}
