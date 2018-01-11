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

function renderView (form: Form<DocumentUpload>, res: express.Response): void {
  const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
  const files: UploadedDocument[] = draft.document.uploadedDocuments
  const fileToUpload: DocumentType = draft.document.fileToUpload
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
  const canContinue: boolean = minDifferentFilesRequired === differentFilesCount

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
    const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
    const form = new Form(new DocumentUpload())
    if (draft.document.fileToUploadError) {
      const validationError = new ValidationError()
      validationError.property = 'files'
      validationError.target = 'files'
      validationError.constraints = { ['files']: draft.document.fileToUploadError.displayValue }
      form.errors.push(new FormValidationError(validationError, ''))
    }
    renderView(form, res)
  })
  .post(Paths.documentUploadPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftCertificateOfService> = res.locals.legalCertificateOfServiceDraft
      const form = req.body
      if (form.particularsOfClaim) {
        draft.document.fileToUpload = DocumentType.PARTICULARS_OF_CLAIM
      } else if (form.medicalReport) {
        draft.document.fileToUpload = DocumentType.MEDICAL_REPORTS
      } else if (form.scheduleOfLoss) {
        draft.document.fileToUpload = DocumentType.SCHEDULE_OF_LOSS
      } else if (form.other) {
        draft.document.fileToUpload = DocumentType.OTHER
      }

      draft.document.fileToUploadError = undefined

      await new DraftService().save(draft, res.locals.user.bearerToken)

      res.redirect(Paths.documentUploadPage.uri)
    })
  )
