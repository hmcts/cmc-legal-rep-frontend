import * as express from 'express'
import Defendant from 'app/drafts/models/defendant'

export class Defendants {

  static addDefendant (res: express.Response) {
    let defendants: Defendant[] = []

    if (!res.locals.user.legalClaimDraft.defendants || res.locals.user.legalClaimDraft.defendants.length === 0) {
      defendants.push(new Defendant())
    } else {
      res.locals.user.legalClaimDraft.defendants.map((defendant) => defendants.push(new Defendant().deserialize(defendant)))
      defendants.push(new Defendant())
    }

    res.locals.user.legalClaimDraft.defendants = defendants
  }

  static getCurrentNumber (res: express.Response): number {
    return res.locals.user.legalClaimDraft.defendants.length - 1
  }
}
