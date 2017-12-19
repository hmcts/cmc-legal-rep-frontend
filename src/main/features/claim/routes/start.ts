import * as express from 'express'
import { Paths } from 'claim/paths'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftLegalClaim } from 'drafts/models/draftLegalClaim'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'

export default express.Router()

  .get(Paths.startPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.startPage.associatedView)
  })

  .post(Paths.startPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const draft: Draft<DraftLegalClaim> = res.locals.legalClaimDraft
    const legalCertificateOfServiceDraft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
    try {
      if (draft && draft.id) {
        await new DraftService().delete(draft.id, res.locals.user.bearerToken)
      }

      if (legalCertificateOfServiceDraft && legalCertificateOfServiceDraft.id) {
        await new DraftService().delete(legalCertificateOfServiceDraft.id, res.locals.user.bearerToken)
      }

      res.redirect(Paths.representativeNamePage.uri)
    } catch (err) {
      next(err)
    }

  })
