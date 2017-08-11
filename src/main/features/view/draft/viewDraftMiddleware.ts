import * as express from 'express'

import { DraftMiddleware } from 'common/draft/draftMiddleware'
import DraftView from 'app/drafts/models/draftView'

const deserialize = (value: any): DraftView => {
  return new DraftView().deserialize(value)
}

const middleware = new DraftMiddleware<DraftView>('view', deserialize)

export class ViewDraftMiddleware {

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
