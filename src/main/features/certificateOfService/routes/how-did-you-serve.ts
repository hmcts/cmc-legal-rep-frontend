import * as express from 'express'
import { Paths } from 'certificateOfService/paths'

import { Form } from 'app/forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { WhatDocuments } from 'app/forms/models/whatDocuments'
import ErrorHandling from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'
import ClaimStoreClient from 'claims/claimStoreClient'
import { DraftDashboard } from 'drafts/models/draftDashboard'
import Claim from 'app/claims/models/claim'
import { HowDidYouServe } from 'forms/models/howDidYouServe'

async function renderView (form: Form<WhatDocuments>, res: express.Response): Promise<void> {
  const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
  const dashboardDraft: Draft<DraftDashboard> = res.locals.dashboardDraft
  if (draft.document.defendants.length === 0) {
    const claim: Claim = await ClaimStoreClient.retrieveByClaimReference(dashboardDraft.document.search.reference, res.locals.user.bearerToken)
    draft.document.defendants = claim.claimData.defendants

    await new DraftService().save(draft, res.locals.user.bearerToken)
  }
  res.render(Paths.howDidYouServePage.associatedView, {
    form: form,
    partyStripeTitle: 'Defendant ' + draft.document.currentDefendant,
    heading: draft.document.defendants[draft.document.currentDefendant - 1].name,
    defendantType: draft.document.defendants[draft.document.currentDefendant - 1].type
  })
}

export default express.Router()
  .get(Paths.howDidYouServePage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
    await renderView(new Form(draft.document.defendants[draft.document.currentDefendant - 1].howWereYouServed), res)
  }))
  .post(Paths.howDidYouServePage.uri, FormValidator.requestHandler(HowDidYouServe, HowDidYouServe.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
      const form: Form<HowDidYouServe> = req.body
      if (form.hasErrors()) {
        await renderView(form, res)
      } else {
        draft.document.defendants[draft.document.currentDefendant - 1].howWereYouServed = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)

        res.redirect(Paths.howDidYouServePage.uri)
      }

    })
  )
