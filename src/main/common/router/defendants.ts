import * as express from 'express'
import Defendant from 'app/drafts/models/defendant'

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

  static getCurrentNumber (res: express.Response): number {
    return res.locals.user.legalClaimDraft.defendants.length - 1
  }
}
