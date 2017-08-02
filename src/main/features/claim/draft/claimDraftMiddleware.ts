import * as express from 'express'

import { DraftMiddleware } from 'common/draft/draftMiddleware'
import DraftLegalClaim from 'app/drafts/models/draftLegalClaim'

const deserialize = (value: any): DraftLegalClaim => {
  return new DraftLegalClaim().deserialize(value)
}

const middleware = new DraftMiddleware<DraftLegalClaim>('legalClaim', deserialize)

export class ClaimDraftMiddleware {

  static retrieve (req: express.Request, res: express.Response, next: express.NextFunction): void {
    middleware.retrieve(res, next)
  }

  static save (res: express.Response, next: express.NextFunction): Promise<void> {
    return middleware.save(res, next)
  }

  static delete (res: express.Response, next: express.NextFunction): Promise<void> {
    return middleware.delete(res, next)
  }
}
