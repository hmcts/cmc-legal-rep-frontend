import * as express from 'express'
import { Paths } from 'certificateOfService/paths'
import { DraftService } from 'services/draftService'
import { UploadedDocument } from 'claims/models/uploadedDocument'
import { DocumentType } from 'forms/models/documentType'
import { WhatDocuments } from 'forms/models/whatDocuments'
import { Form, FormValidationError } from 'app/forms/form'
import { ValidationError } from 'class-validator'
import ErrorHandling from 'common/errorHandling'
import { FileTypes } from 'forms/models/fileTypes'
import { DocumentUpload } from 'forms/models/documentUpload'
import { Draft } from '@hmcts/draft-store-client'
import { DraftCertificateOfService } from 'drafts/models/draftCertificateOfService'
import { DraftUploadDocument } from 'drafts/models/draftUploadDocument'

function renderView (form: Form<DocumentUpload>, res: express.Response): void {
  const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
  const viewDraft: Draft<DraftUploadDocument> = res.locals.legalUploadDocumentDraft
  const files: UploadedDocument[] = draft.document.uploadedDocuments
  const fileToUpload: DocumentType = viewDraft.document.fileToUpload
  const whatDocuments: WhatDocuments = draft.document.whatDocuments

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
  const differentFilesCount: number = files.reduce((accumulator, currentValue) => accumulator + 1, 0)
  const canContinue: boolean = minDifferentFilesRequired < differentFilesCount

  res.render(Paths.documentUploadPage.associatedView,
    {
      form: form,
      particularsOfClaim: particularsOfClaim,
      medicalReport: medicalReport,
      scheduleOfLoss: scheduleOfLoss,
      other: other,
      whatDocuments: whatDocuments,
      fileToUpload: fileToUpload,
      canContinue: canContinue,
      acceptedFiles: FileTypes.acceptedFiles()
    })
}

export default express.Router()
  .get(Paths.documentUploadPage.uri, (req: express.Request, res: express.Response) => {
    const viewDraft: Draft<DraftUploadDocument> = res.locals.legalUploadDocumentDraft
    const form = new Form(new DocumentUpload())
    if (viewDraft.document.fileToUploadError) {
      const validationError = new ValidationError()
      validationError.property = 'files'
      validationError.target = 'files'
      validationError.constraints = { ['files']: viewDraft.document.fileToUploadError.displayValue }
      form.errors.push(new FormValidationError(validationError, ''))
    }
    renderView(form, res)
  })
  .post(Paths.documentUploadPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const viewDraft: Draft<DraftUploadDocument> = res.locals.legalUploadDocumentDraft
      const form = req.body
      if (form.particularsOfClaim) {
        viewDraft.document.fileToUpload = DocumentType.PARTICULARS_OF_CLAIM
      } else if (form.medicalReport) {
        viewDraft.document.fileToUpload = DocumentType.MEDICAL_REPORTS
      } else if (form.scheduleOfLoss) {
        viewDraft.document.fileToUpload = DocumentType.SCHEDULE_OF_LOSS
      } else if (form.other) {
        viewDraft.document.fileToUpload = DocumentType.OTHER
      }
      viewDraft.document.fileToUploadError = undefined

      await new DraftService().save(viewDraft, res.locals.user.bearerToken)

      if (form.saveAndContinue) {
        res.redirect(Paths.howDidYouServePage.uri)
      } else {
        res.redirect(Paths.documentUploadPage.uri)
      }
    })
  )
