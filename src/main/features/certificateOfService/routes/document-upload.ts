import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import { DraftService } from '../../../services/draftService'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { DocumentType } from 'forms/models/documentType'

function renderView (res: express.Response): void {
  const files: UploadedDocument = res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments
  const fileToUpload: string = res.locals.user.legalUploadDocumentDraft.document.fileToUpload
  res.render(Paths.documentUploadPage.associatedView,
    {
      files: files,
      whatDocuments: res.locals.user.legalCertificateOfServiceDraft.document.whatDocuments,
      fileToUpload: fileToUpload
    })
}

export default express.Router()
  .get(Paths.documentUploadPage.uri, (req: express.Request, res: express.Response) => {
    // console.log(res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments)
    // console.log(DocumentType.PARTICULARS_OF_CLAIM.value)
    renderView(res)
  })
  .post(Paths.documentUploadPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const form = req.body
    if (form.particularsOfClaim) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = DocumentType.PARTICULARS_OF_CLAIM.value
    } else if (form.medicalReport) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = DocumentType.MEDICAL_REPORTS.value
    } else if (form.scheduleOfLoss) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = DocumentType.SCHEDULE_OF_LOSS.value
    } else if (form.other) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = DocumentType.OTHER.value
    }

    await new DraftService().save(res.locals.user.legalUploadDocumentDraft, res.locals.user.bearerToken)

    res.redirect(Paths.documentUploadPage.uri)
  })
