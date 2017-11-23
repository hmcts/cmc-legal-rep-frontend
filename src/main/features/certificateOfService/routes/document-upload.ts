import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import { DraftService } from 'services/draftService'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { DocumentType } from 'forms/models/documentType'
import { WhatDocuments } from 'forms/models/whatDocuments'

function renderView (res: express.Response): void {
  const files: UploadedDocument[] = res.locals.user.legalCertificateOfServiceDraft.document.uploadedDocuments
  const fileToUpload: DocumentType = res.locals.user.legalUploadDocumentDraft.document.fileToUpload
  const whatDocuments: WhatDocuments = res.locals.user.legalCertificateOfServiceDraft.document.whatDocuments

  const particularsOfClaim: UploadedDocument[] = files.filter(function (file: UploadedDocument) {
    return file.documentType.value === DocumentType.PARTICULARS_OF_CLAIM.value
  })
  const medicalReport: UploadedDocument[] = files.filter(function (file: UploadedDocument) {
    return file.documentType.value === DocumentType.MEDICAL_REPORTS.value
  })
  const scheduleOfLoss: UploadedDocument[] = files.filter(function (file: UploadedDocument) {
    return file.documentType.value === DocumentType.SCHEDULE_OF_LOSS.value
  })
  const other: UploadedDocument[] = files.filter(function (file: UploadedDocument) {
    return file.documentType.value === DocumentType.OTHER.value
  })

  const minDifferentFilesRequired: number = (whatDocuments.types.indexOf('responsePack') !== -1) ? whatDocuments.types.length : whatDocuments.types.length - 1

  let differentFilesCount: number = 0
  files.forEach(function (file: UploadedDocument) {
    if (whatDocuments.types.indexOf(file.documentType.dataStoreValue) !== -1 || file.documentType.dataStoreValue === DocumentType.PARTICULARS_OF_CLAIM.dataStoreValue) {
      differentFilesCount++
    }
  })
  const canContinue: boolean = minDifferentFilesRequired === differentFilesCount

  res.render(Paths.documentUploadPage.associatedView,
    {
      particularsOfClaim: particularsOfClaim,
      medicalReport: medicalReport,
      scheduleOfLoss: scheduleOfLoss,
      other: other,
      whatDocuments: whatDocuments,
      fileToUpload: fileToUpload,
      canContinue: canContinue
    })
}

export default express.Router()
  .get(Paths.documentUploadPage.uri, (req: express.Request, res: express.Response) => {
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
