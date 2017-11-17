import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import { DraftService } from '../../../services/draftService'

function renderView (res: express.Response): void {
  res.render(Paths.documentUploadPage.associatedView,
    {
      files: res.locals.user.legalCertificateOfServiceDraft.uploadedDocuments,
      whatDocuments: res.locals.user.legalCertificateOfServiceDraft.document.whatDocuments,
      fileToUpload: res.locals.user.legalUploadDocumentDraft.document.fileToUpload
    })
}

export default express.Router()
  .get(Paths.documentUploadPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(Paths.documentUploadPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const form = req.body
    if (form.particularsOfClaim) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = 'particularsOfClaim'
    } else if (form.medicalReport) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = 'medicalReport'
    } else if (form.scheduleOfLoss) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = 'scheduleOfLoss'
    } else if (form.other) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = 'other'
    }

    await new DraftService().save(res.locals.user.legalUploadDocumentDraft, res.locals.user.bearerToken)

    res.redirect(Paths.documentUploadPage.uri)
  })
