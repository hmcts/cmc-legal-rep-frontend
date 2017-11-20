import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import { DraftService } from '../../../services/draftService'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { DocumentType } from 'forms/models/documentType'

function renderView (res: express.Response): void {
  const files: UploadedDocument[] = res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments
  const particularsOfClaim = files.filter(function (file: UploadedDocument) {
    // console.log(file.documentType)
    // console.log(DocumentType.PARTICULARS_OF_CLAIM)
    return file.documentType === DocumentType.PARTICULARS_OF_CLAIM
  })
  const medicalReports = files.filter(function (file: UploadedDocument) {
    return file.documentType === DocumentType.MEDICAL_REPORTS
  })
  const scheduleOfLoss = files.filter(function (file: UploadedDocument) {
    return file.documentType === DocumentType.SCHEDULE_OF_LOSS
  })
  const other = files.filter(function (file: UploadedDocument) {
    return file.documentType === DocumentType.OTHER
  })
  const fileToUpload: DocumentType = res.locals.user.legalUploadDocumentDraft.document.fileToUpload
  res.render(Paths.documentUploadPage.associatedView,
    {
      particularsOfClaim: particularsOfClaim,
      medicalReports: medicalReports,
      scheduleOfLoss: scheduleOfLoss,
      other: other,
      whatDocuments: res.locals.user.legalCertificateOfServiceDraft.document.whatDocuments,
      fileToUpload: fileToUpload
    })
}

export default express.Router()
  .get(Paths.documentUploadPage.uri, (req: express.Request, res: express.Response) => {
    // console.log(res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments)
    // console.log(res.locals.user.legalUploadDocumentDraft.document.fileToUpload)
    renderView(res)
  })
  .post(Paths.documentUploadPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const form = req.body
    if (form.particularsOfClaim) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = DocumentType.PARTICULARS_OF_CLAIM
    } else if (form.medicalReport) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = DocumentType.MEDICAL_REPORTS
    } else if (form.scheduleOfLoss) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = DocumentType.SCHEDULE_OF_LOSS
    } else if (form.other) {
      res.locals.user.legalUploadDocumentDraft.document.fileToUpload = DocumentType.OTHER
    }

    await new DraftService().save(res.locals.user.legalUploadDocumentDraft, res.locals.user.bearerToken)

    res.redirect(Paths.documentUploadPage.uri)
  })
