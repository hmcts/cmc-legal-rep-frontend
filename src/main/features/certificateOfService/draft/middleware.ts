import * as express from 'express'

import { DraftMiddleware } from 'common/draft/draftMiddleware'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'

const deserialize = (value: any): DraftCertificateOfService => {
  return new DraftCertificateOfService().deserialize(value)
}

const middleware = new DraftMiddleware<DraftCertificateOfService>('legalCertificateOfService', deserialize)

export class CertificateOfServiceDraftMiddleware {

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
