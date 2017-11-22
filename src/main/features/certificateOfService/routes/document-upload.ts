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

  const particularsOfClaim = files.filter(function (file: UploadedDocument) {
    return file.documentType.value === DocumentType.PARTICULARS_OF_CLAIM.value
  })
  const medicalReport = files.filter(function (file: UploadedDocument) {
    return file.documentType.value === DocumentType.MEDICAL_REPORTS.value
  })
  const scheduleOfLoss = files.filter(function (file: UploadedDocument) {
    return file.documentType.value === DocumentType.SCHEDULE_OF_LOSS.value
  })
  const other = files.filter(function (file: UploadedDocument) {
    return file.documentType.value === DocumentType.OTHER.value
  })

  const minDifferentFilesRequired: number = whatDocuments.types.splice(whatDocuments.types.indexOf('responsePack'), 1).length
  let differentFilesCount: number = 0
  files.forEach(function (file: UploadedDocument) {
    // console.log(file.documentType)
    // console.log(whatDocuments)
    if (whatDocuments.types.indexOf(file.documentType.value) !== -1 || file.documentType.value === DocumentType.PARTICULARS_OF_CLAIM.value) {
      differentFilesCount++
    }
  })
  const canContinue: boolean = minDifferentFilesRequired === differentFilesCount
  // console.log(minDifferentFilesRequired)
  // console.log(differentFilesCount)

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
